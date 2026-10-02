"use client";

import Button from "@/components/ui/Button";

/** Affiché quand une page ne peut pas être calculée (catalogue injoignable, par exemple). */
export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container" style={{ padding: "var(--space-section) var(--gutter-page)" }}>
      <h1 style={{ font: "var(--type-heading-xl)", margin: "0 0 var(--space-md)" }}>
        Le catalogue est momentanément indisponible
      </h1>
      <p style={{ color: "var(--charcoal)", margin: "0 0 var(--space-xl)", maxWidth: "52ch" }}>
        Un incident technique nous empêche d’afficher cette page. Réessayez dans un instant.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
