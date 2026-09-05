import TransitionLink from "./TransitionLink";
import Magnetic from "./Magnetic";

export default function Button({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const base = "group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500";
  const styles = variant === "primary" ? "border-transparent bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone";
  return (
    <Magnetic>
      <TransitionLink href={href} className={`${base} ${styles}`} data-cursor="">
        <span className="relative z-10">{children}</span>
        <span aria-hidden className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">→</span>
        {variant === "primary" && (
          <span aria-hidden className="absolute inset-0 -translate-y-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)] group-hover:translate-y-0" />
        )}
      </TransitionLink>
    </Magnetic>
  );
}
