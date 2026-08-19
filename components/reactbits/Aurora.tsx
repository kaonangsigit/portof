"use client";
// ReactBits — Aurora background
// Flowing aurora gradient with animated canvas
// Source: https://www.reactbits.dev/backgrounds/aurora
import { useEffect, useRef } from "react";

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
}

export default function Aurora({
  colorStops = ["#3b82f6", "#8b5cf6", "#06b6d4"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  className = "",
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_res;
      uniform vec3  u_c0;
      uniform vec3  u_c1;
      uniform vec3  u_c2;
      uniform float u_amp;
      uniform float u_blend;

      float wave(vec2 uv, float t, float freq, float speed, float phase){
        return sin(uv.x * freq + t * speed + phase) * 0.5 + 0.5;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;

        float w0 = wave(uv, u_time, 3.0, 0.8, 0.0)  * u_amp;
        float w1 = wave(uv, u_time, 4.5, 0.5, 2.1)  * u_amp;
        float w2 = wave(uv, u_time, 2.8, 0.65, 4.2) * u_amp;

        float y0 = w0 * 0.6 + uv.y * 0.4;
        float y1 = w1 * 0.6 + uv.y * 0.4;
        float y2 = w2 * 0.6 + uv.y * 0.4;

        float m0 = smoothstep(0.3, 0.7, y0);
        float m1 = smoothstep(0.3, 0.7, y1);
        float m2 = smoothstep(0.3, 0.7, y2);

        vec3 col = mix(u_c0, u_c1, m0);
        col = mix(col, u_c2, m1 * m2 * u_blend);

        float alpha = (m0 + m1 + m2) * 0.18 * u_amp;
        alpha = clamp(alpha, 0.0, 0.55);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uC0    = gl.getUniformLocation(prog, "u_c0");
    const uC1    = gl.getUniformLocation(prog, "u_c1");
    const uC2    = gl.getUniformLocation(prog, "u_c2");
    const uAmp   = gl.getUniformLocation(prog, "u_amp");
    const uBlend = gl.getUniformLocation(prog, "u_blend");

    const hex2rgb = (h: string): [number, number, number] => {
      const r = parseInt(h.slice(1,3),16)/255;
      const g = parseInt(h.slice(3,5),16)/255;
      const b = parseInt(h.slice(5,7),16)/255;
      return [r, g, b];
    };

    const [r0,g0,b0] = hex2rgb(colorStops[0] ?? "#3b82f6");
    const [r1,g1,b1] = hex2rgb(colorStops[1] ?? "#8b5cf6");
    const [r2,g2,b2] = hex2rgb(colorStops[2] ?? "#06b6d4");

    gl.uniform3f(uC0, r0, g0, b0);
    gl.uniform3f(uC1, r1, g1, b1);
    gl.uniform3f(uC2, r2, g2, b2);
    gl.uniform1f(uAmp, amplitude);
    gl.uniform1f(uBlend, blend);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const tick = () => {
      t += 0.008 * speed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.deleteProgram(prog);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
