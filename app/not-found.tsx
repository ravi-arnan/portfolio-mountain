import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center px-6 md:px-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 text-5xl font-medium tracking-tight md:text-8xl">Nothing here.</h1>
      <div className="mt-10"><Button href="/">Back home</Button></div>
    </main>
  );
}
