import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "var(--space-section) var(--gutter-page)" }}>
      <h1 style={{ font: "var(--type-heading-xl)", margin: "0 0 var(--space-md)" }}>Cette page n’existe pas</h1>
      <p style={{ color: "var(--charcoal)", margin: "0 0 var(--space-xl)", maxWidth: "52ch" }}>
        L’objet a peut-être été vendu : chaque pièce est unique et quitte le catalogue une fois achetée.
      </p>
      <Button href="/">Retour à l’accueil</Button>
    </div>
  );
}
