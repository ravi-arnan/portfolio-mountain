"use client";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useExperienceStore } from "@/store/experience";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode };

export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const pathname = usePathname();
  const setPendingHref = useExperienceStore((s) => s.setPendingHref);
  const pending = useExperienceStore((s) => s.pendingHref);

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const target = typeof href === "string" ? href : (href as { pathname?: string }).pathname ?? "/";
    const isExternal = /^https?:\/\//.test(target) || target.startsWith("mailto:");
    if (isExternal || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;
    e.preventDefault();
    if (target === pathname || pending) return;
    setPendingHref(target);
  };
  return <Link href={href} onClick={handle} {...rest}>{children}</Link>;
}
