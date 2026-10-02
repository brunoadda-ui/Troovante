import Link from "next/link";
import type { ReactNode } from "react";
import s from "./ui.module.css";

export default function FilterChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={s.chip}>
      {children}
    </Link>
  );
}
