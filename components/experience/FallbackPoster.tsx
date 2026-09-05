export default function FallbackPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/posters/hero-poster.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
