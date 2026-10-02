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
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  href,
  onClick,
  type = "button",
}: Props) {
  const className = [s.button, s[variant], s[size], full ? s.full : ""].filter(Boolean).join(" ");

  if (href) {
    // Les liens tel:, mailto: et externes ne passent pas par le routeur.
    const interne = href.startsWith("/");
    return interne ? (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    ) : (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
