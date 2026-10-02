import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import s from "./ui.module.css";

type Props = {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** Ligne dépliable (fiche objet). Élément natif : fonctionne sans JavaScript. */
export default function DisclosureRow({ label, children, defaultOpen = false }: Props) {
  return (
    <details className={s.disclosure} open={defaultOpen}>
      <summary className={s.disclosureSummary}>
        {label}
        <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" className={s.disclosureChevron} />
      </summary>
      <div className={s.disclosureBody}>{children}</div>
    </details>
  );
}
