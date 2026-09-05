import TransitionLink from "@/components/ui/TransitionLink";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-starlight/10 px-6 pb-10 pt-16 md:px-12">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Ravi Arnan</p>
          <p className="mt-4 max-w-sm text-lg text-starlight/70">Developer & designer. Open for new work.</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Site</p>
          <ul className="mt-4 space-y-2">
            {[["/work", "Work"], ["/about", "About"], ["/contact", "Contact"]].map(([h, l]) => (
              <li key={h}><TransitionLink href={h} className="link-underline">{l}</TransitionLink></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            <li><a href="https://github.com/CHANGE_ME" target="_blank" rel="noreferrer" className="link-underline">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/CHANGE_ME" target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a></li>
            <li><a href="mailto:hello@raviarnan.dev" className="link-underline">hello@raviarnan.dev</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-16 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        <span>© {new Date().getFullYear()}</span>
        <span>Built with Next.js · Three.js · GSAP</span>
      </div>
    </footer>
  );
}
