"use client";

import { Heart } from "lucide-react";
import { basculerFavori, useFavoris } from "@/lib/favoris";
import s from "./Favoris.module.css";

type Props = {
  slug: string;
  nom: string;
  /** « pastille » : rond blanc posé sur une photo. « texte » : lien avec libellé. */
  variante?: "pastille" | "texte";
  className?: string;
};

export default function FavoriButton({ slug, nom, variante = "pastille", className }: Props) {
  const actif = useFavoris().includes(slug);

  return (
    <button
      type="button"
      aria-pressed={actif}
      aria-label={variante === "pastille" ? `${actif ? "Retirer" : "Ajouter"} « ${nom} » ${actif ? "des" : "aux"} favoris` : undefined}
      onClick={() => basculerFavori(slug)}
      className={[variante === "pastille" ? s.pastille : s.texte, className].filter(Boolean).join(" ")}
    >
      <Heart size={18} strokeWidth={1.5} aria-hidden="true" fill={actif ? "currentColor" : "none"} />
      {variante === "texte" && (actif ? "Dans vos favoris" : "Ajouter aux favoris")}
    </button>
  );
}
