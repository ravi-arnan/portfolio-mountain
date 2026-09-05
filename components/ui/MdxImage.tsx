import ProjectImage from "./ProjectImage";

export default function MdxImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="my-12">
      <ProjectImage src={src} alt={alt ?? ""} className="aspect-[16/10] w-full rounded-sm" />
      {alt && <figcaption className="mt-3 font-mono text-xs text-muted">{alt}</figcaption>}
    </figure>
  );
}
