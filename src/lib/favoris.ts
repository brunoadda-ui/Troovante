"use client";

import { useSyncExternalStore } from "react";

/**
 * Les favoris sont gardés dans le navigateur du visiteur (pas de compte
 * nécessaire) : une simple liste de slugs d'objets, la plus récente en tête.
 */

const CLE = "troovante:favoris";
const EVENEMENT = "troovante:favoris";
const MAXIMUM = 200;
const VIDE: string[] = [];

// La même liste doit être renvoyée tant que rien n'a changé, sinon React boucle.
let memo: { brut: string | null; liste: string[] } = { brut: null, liste: VIDE };

function lire(): string[] {
  let brut: string | null = null;
  try {
    brut = window.localStorage.getItem(CLE);
  } catch {
    // Stockage indisponible (navigation privée stricte) : pas de favoris.
  }
  if (brut === memo.brut) return memo.liste;

  let liste = VIDE;
  try {
    const valeur: unknown = JSON.parse(brut ?? "[]");
    if (Array.isArray(valeur)) liste = valeur.filter((v): v is string => typeof v === "string");
  } catch {
    // Contenu illisible : on repart d'une liste vide.
  }
  memo = { brut, liste };
  return liste;
}

function abonner(surChangement: () => void) {
  window.addEventListener("storage", surChangement);
  window.addEventListener(EVENEMENT, surChangement);
  return () => {
    window.removeEventListener("storage", surChangement);
    window.removeEventListener(EVENEMENT, surChangement);
  };
}

/** La liste des slugs en favori. Vide pendant le rendu côté serveur. */
export function useFavoris(): string[] {
  return useSyncExternalStore(abonner, lire, () => VIDE);
}

const jamais = () => () => {};

/** Faux côté serveur et au tout premier affichage, vrai ensuite. */
export function useEstMonte(): boolean {
  return useSyncExternalStore(
    jamais,
    () => true,
    () => false,
  );
}

export function basculerFavori(slug: string) {
  const liste = lire();
  const suivante = liste.includes(slug) ? liste.filter((s) => s !== slug) : [slug, ...liste].slice(0, MAXIMUM);
  try {
    window.localStorage.setItem(CLE, JSON.stringify(suivante));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENEMENT));
}
