"use client";
import { useState, type FormEvent } from "react";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) next.email = "Please add a valid email.";
    if ((data.message ?? "").trim().length < 10) next.message = "Tell me a little more (10+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      setStatus("sent"); form.reset();
    } catch { setStatus("error"); }
  };

  const field = "w-full border-b border-bone/20 bg-transparent py-4 text-lg outline-none transition-colors focus:border-bone placeholder:text-muted";

  return (
    <form onSubmit={submit} noValidate className="space-y-10">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="name" className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Name</label>
        <input id="name" name="name" className={field} placeholder="Your name" aria-describedby={errors.name ? "name-err" : undefined} />
        {errors.name && <p id="name-err" role="alert" className="mt-2 text-sm text-warm">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Email</label>
        <input id="email" name="email" type="email" className={field} placeholder="you@company.com" aria-describedby={errors.email ? "email-err" : undefined} />
        {errors.email && <p id="email-err" role="alert" className="mt-2 text-sm text-warm">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Project</label>
        <textarea id="message" name="message" rows={4} className={`${field} resize-none`} placeholder="What are you building?" aria-describedby={errors.message ? "msg-err" : undefined} />
        {errors.message && <p id="msg-err" role="alert" className="mt-2 text-sm text-warm">{errors.message}</p>}
      </div>
      <div className="flex items-center gap-6">
        <Magnetic>
          <button type="submit" disabled={status === "sending"} className="rounded-full bg-bone px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-accent disabled:opacity-50">
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </Magnetic>
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {status === "sent" && "Thanks — I’ll reply within two working days."}
          {status === "error" && (<>Something went wrong. Email me directly at <a href="mailto:hello@raviarnan.dev" className="underline">hello@raviarnan.dev</a>.</>)}
        </p>
      </div>
    </form>
  );
}
