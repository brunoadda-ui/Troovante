"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { TRIS, urlListe, type EtatListe, type Tri } from "@/lib/filtres";
import s from "./Liste.module.css";

/** Menu « Trier par » : change l'adresse de la page, qui se recalcule côté serveur. */
export default function TriSelect({ chemin, etat }: { chemin: string; etat: EtatListe }) {
  const router = useRouter();
  const [, demarrer] = useTransition();
  // Affiche tout de suite le choix, sans attendre le retour du serveur.
  const [tri, setTri] = useOptimistic(etat.tri);

  return (
    <select
      className={s.sort}
      aria-label="Trier les résultats"
      value={tri}
      onChange={(e) => {
        const choix = e.target.value as Tri;
        demarrer(() => {
          setTri(choix);
          router.replace(urlListe(chemin, { ...etat, tri: choix, n: undefined }), { scroll: false });
        });
      }}
    >
      {TRIS.map((t) => (
        <option key={t.valeur} value={t.valeur}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
