"use client";

/**
 * Dernier filet : affiché si même l'en-tête du site ne peut pas être calculé
 * (base de données injoignable). Cette page doit se suffire à elle-même.
 */
export default function ErreurGlobale({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 48, fontFamily: "Helvetica, Arial, sans-serif", color: "#111111" }}>
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "0 0 12px" }}>TROOVANTE est momentanément indisponible</h1>
        <p style={{ color: "#39393b", margin: "0 0 24px", maxWidth: "52ch", lineHeight: 1.5 }}>
          Un incident technique nous empêche d’afficher le site. Réessayez dans un instant.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            font: "inherit",
            fontWeight: 500,
            color: "#ffffff",
            background: "#111111",
            border: "none",
            borderRadius: 30,
            padding: "16px 32px",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
