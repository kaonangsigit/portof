import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kao Nangprakoso - Full-Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #1e40af, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          Kao Nangprakoso
        </div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          Full-Stack Developer
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.8,
            marginTop: 20,
            display: 'flex',
            gap: 20,
          }}
        >
          <span>React</span>
          <span>•</span>
          <span>Next.js</span>
          <span>•</span>
          <span>TypeScript</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
