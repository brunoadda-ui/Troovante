import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import s from "./ui.module.css";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  /** Avec `href`, le bouton est rendu comme un lien. */
  href?: string;
  /** Lien interne : `false` pour rester au même endroit de la page (« Voir plus »). */
  scroll?: boolean;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  href,
  scroll,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const className = [s.button, s[variant], s[size], full ? s.full : ""].filter(Boolean).join(" ");

  if (href) {
    // Les liens tel:, mailto: et externes ne passent pas par le routeur.
    const interne = href.startsWith("/");
    return interne ? (
      <Link href={href} className={className} onClick={onClick} scroll={scroll}>
        {children}
      </Link>
    ) : (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
