"use client";

import { useEffect, useState } from "react";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import { useEstMonte, useFavoris } from "@/lib/favoris";
import type { CarteObjet } from "@/lib/types";
import s from "./Favoris.module.css";

/** Les favoris vivent dans le navigateur : la liste se charge donc après l'affichage de la page. */
export default function ListeFavoris() {
  const monte = useEstMonte();
  const slugs = useFavoris();
  const cle = slugs.join(",");
  const [charge, setCharge] = useState<{ cle: string; cartes: CarteObjet[] } | null>(null);

  useEffect(() => {
    if (!cle) return;
    let annule = false;
    fetch(`/api/objets?slugs=${encodeURIComponent(cle)}`)
      .then((reponse) => (reponse.ok ? reponse.json() : []))
      .then((cartes: CarteObjet[]) => {
        if (!annule) setCharge({ cle, cartes });
      })
      .catch(() => {
        if (!annule) setCharge({ cle, cartes: [] });
      });
    return () => {
      annule = true;
    };
  }, [cle]);

  if (!monte) return null;

  if (slugs.length === 0) {
    return (
      <div className={s.empty}>
        <p>
          Vous n’avez pas encore de favori. Touchez le cœur d’un objet pour le retrouver ici : chaque pièce est unique,
          autant ne pas la perdre de vue.
        </p>
        <Button href="/">Parcourir les objets</Button>
      </div>
    );
  }

  if (!charge) return <p className={s.note}>Chargement de vos favoris…</p>;

  // Pendant un rechargement, on garde l'ancienne liste, moins les favoris retirés.
  const cartes = charge.cartes.filter((carte) => slugs.includes(carte.slug));
  const vendus = charge.cle === cle ? slugs.length - cartes.length : 0;

  return (
    <>
      {vendus > 0 && (
        <p className={s.note}>
          {vendus === 1
            ? "Un de vos favoris n’est plus au catalogue : il a sans doute été vendu."
            : `${vendus} de vos favoris ne sont plus au catalogue : ils ont sans doute été vendus.`}
        </p>
      )}
      <div className={s.grid}>
        {cartes.map((carte) => (
          <ObjetCard
            key={carte.slug}
            objet={carte}
            ratio="4 / 5"
            sizes="(min-width: 1024px) 25vw, 50vw"
            mention="Pièce unique"
            favori
          />
        ))}
      </div>
    </>
  );
}
