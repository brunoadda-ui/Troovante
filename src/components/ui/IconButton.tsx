import type { ReactNode } from "react";
import s from "./ui.module.css";

type Props = {
  /** Texte lu par les lecteurs d'écran, l'icône seule n'étant pas explicite. */
  label: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function IconButton({ label, children, onClick, className }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[s.iconButton, className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
