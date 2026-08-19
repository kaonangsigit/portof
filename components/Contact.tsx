"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import ClickSpark from "@/components/reactbits/ClickSpark";

interface PersonalData {
  email: string; location: string; availability: string;
  socialLinks: { github?: string; linkedin?: string };
}

const DEFAULT: PersonalData = { email:"", location:"", availability:"", socialLinks:{} };
type Status = "idle"|"loading"|"success"|"error";

const INFO = [
  { key:"email",        icon:"✉️", label:"Email",    accent:"hover:border-blue-500/50"   },
  { key:"location",     icon:"📍", label:"Location", accent:"hover:border-purple-500/50" },
  { key:"availability", icon:"⚡", label:"Status",   accent:"hover:border-amber-500/50"  },
] as const;

export default function Contact() {
  const [p, setP]       = useState<PersonalData>(DEFAULT);
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d && typeof d === "object") setP({ email:d.email??"", location:d.location??"", availability:d.availability??"", socialLinks:d.socialLinks??{} }); })
      .catch(() => {});
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setErrMsg("");
    try {
      const res = await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error");
      setStatus("success"); setForm({name:"",email:"",message:""});
    } catch(err) {
      setStatus("error"); setErrMsg(err instanceof Error ? err.message : "Failed");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-white/8 bg-white/3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/60 transition-all text-sm";

  const infoValue = (key: typeof INFO[number]["key"]) =>
    key === "email" ? p.email || "contact@example.com" : key === "location" ? p.location || "Indonesia" : p.availability || "Open to Opportunities";

  return (
    <SectionWrapper id="contact" variant="darker"
      header={{ eyebrow: "07 / Contact", title: "Let's Work Together", subtitle: "Available for QA, backend development, and data analysis opportunities." }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* Info */}
        <AnimatedContent distance={40} direction="horizontal" delay={0.05} duration={0.7} threshold={0.08}>
          <div className="space-y-4">
            {INFO.map(({ key, icon, label, accent }) => (
              <SpotlightCard key={key} spotlightColor="rgba(59,130,246,0.07)"
                className={`card-dark p-4 rounded-xl ${accent} transition-colors`}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{label}</p>
                    {key === "availability"
                      ? <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {infoValue(key)}
                        </span>
                      : <p className="text-white font-semibold text-sm break-all">{infoValue(key)}</p>
                    }
                  </div>
                </div>
              </SpotlightCard>
            ))}

            {/* Social */}
            {Object.keys(p.socialLinks).length > 0 && (
              <div className="pt-2 flex flex-wrap gap-3">
                {([
                  { key:"github",   label:"GitHub",   icon:(
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  )},
                  { key:"linkedin", label:"LinkedIn", icon:(
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.662 1.196-1.608 2.907-1.608 2.121 0 3.71 1.395 3.71 4.393v5.488zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.915.762 1.915 1.715 0 .953-.728 1.715-1.958 1.715zm1.6 11.597H3.73V9.67h3.207v10.782zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
                  )},
                ] as const).map(s => {
                  const url = p.socialLinks[s.key];
                  if (!url) return null;
                  return (
                    <a key={s.key} href={url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5
                        card-dark text-gray-400 hover:text-white text-sm font-medium rounded-xl
                        hover:border-blue-500/40 hover:bg-blue-500/8 transition-all hover:scale-105">
                      {s.icon}{s.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </AnimatedContent>

        {/* Form */}
        <AnimatedContent distance={40} direction="horizontal" reverse delay={0.1} duration={0.7} threshold={0.08}>
          <form onSubmit={onSubmit} className="space-y-4">
            {["name","email","message"].map(field => (
              <div key={field}>
                <label className="block text-xs text-gray-500 font-semibold mb-1.5 uppercase tracking-wide">
                  {field.charAt(0).toUpperCase()+field.slice(1)}
                </label>
                {field === "message"
                  ? <textarea name="message" value={form.message} onChange={onChange}
                      required rows={5} placeholder="Your message..." className={inputClass} />
                  : <input type={field==="email"?"email":"text"} name={field}
                      value={form[field as "name"|"email"]} onChange={onChange}
                      required placeholder={field==="email"?"your@email.com":"Your name"}
                      className={inputClass} />
                }
              </div>
            ))}

            {status === "success" && (
              <AnimatedContent distance={8} direction="vertical" duration={0.4}>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                  ✓ Sent successfully! I'll get back to you soon.
                </div>
              </AnimatedContent>
            )}
            {status === "error" && (
              <AnimatedContent distance={8} direction="vertical" duration={0.4}>
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  ✗ {errMsg || "Failed to send. Please try again."}
                </div>
              </AnimatedContent>
            )}

            <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={38}>
              <button type="submit" disabled={status==="loading"}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-500 hover:to-cyan-500
                  text-white font-bold rounded-xl text-sm
                  transition-all duration-300 hover:scale-[1.02]
                  hover:shadow-lg hover:shadow-blue-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {status === "loading"
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  : "Send Message"}
              </button>
            </ClickSpark>
          </form>
        </AnimatedContent>
      </div>
    </SectionWrapper>
  );
}
