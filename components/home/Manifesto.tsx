import RevealText from "@/components/ui/RevealText";

export default function Manifesto() {
  return (
    <section className="px-6 py-32 md:px-12 md:py-48">
      <RevealText as="p" className="max-w-4xl text-3xl font-medium leading-[1.15] tracking-tight md:text-6xl" stagger={0.02}>
        Most websites are read. The best ones have gravity. I work where engineering discipline meets visual curiosity — so the result is fast, accessible, and hard to escape.
      </RevealText>
    </section>
  );
}
