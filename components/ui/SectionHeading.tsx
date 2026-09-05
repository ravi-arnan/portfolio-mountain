import RevealText from "./RevealText";

export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 flex items-end justify-between border-b border-bone/10 pb-6 md:mb-16">
      <RevealText as="h2" className="text-3xl font-medium tracking-tight md:text-5xl">{title}</RevealText>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">{index}</span>
    </div>
  );
}
