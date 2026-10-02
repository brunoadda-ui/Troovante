import type { ReactNode } from "react";
import s from "./ui.module.css";

export default function PromoBadge({ children }: { children: ReactNode }) {
  return <span className={s.badge}>{children}</span>;
}
