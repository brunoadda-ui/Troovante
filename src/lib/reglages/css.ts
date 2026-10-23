import type { CSSProperties } from "react";
import { famillePolice } from "../polices";
import type { ClePolice, SloganRegle, StyleTexte } from "./types";

/**
 * Traduction des réglages en styles CSS. Les tailles sont données pour un
 * écran d'ordinateur (1440 px de large) et se réduisent d'elles-mêmes sur
 * un écran plus petit, sans descendre sous un plancher lisible.
 */

/** 50 px → « clamp(31px, 3.472vw, 50px) » : pleine taille à 1440 px de large, 62 % au minimum. */
export function tailleFluide(px: number): string {
  // Les petits textes ne rétrécissent presque pas : ils deviendraient illisibles.
  const plancher = px >= 28 ? px * 0.62 : Math.max(11, px * 0.85);
  return `clamp(${Math.round(plancher)}px, ${(px / 14.4).toFixed(3)}vw, ${px}px)`;
}

export function styleTexte(style: StyleTexte): CSSProperties {
  return {
    fontFamily: famillePolice(style.police),
    fontSize: tailleFluide(style.taille),
    fontWeight: style.graisse,
    fontStyle: style.italique ? "italic" : "normal",
    textDecoration: style.souligne ? "underline" : "none",
    textUnderlineOffset: style.souligne ? "0.18em" : undefined,
    textDecorationThickness: style.souligne ? "from-font" : undefined,
    textTransform: style.capitales ? "uppercase" : "none",
    letterSpacing: `${style.espacement / 100}em`,
    color: style.couleur,
  };
}

/** Le style complet du slogan : format du texte, interligne, largeur de ligne et ombre portée. */
export function styleSlogan(slogan: SloganRegle): CSSProperties {
  const force = slogan.ombre / 100;
  return {
    ...styleTexte(slogan.style),
    lineHeight: slogan.interligne / 100,
    maxWidth: `${slogan.largeur}ch`,
    textShadow: force > 0 ? `0 2px ${Math.round(4 + force * 24)}px rgb(0 0 0 / ${(force * 0.85).toFixed(2)})` : undefined,
  };
}

/** Noir ou blanc, selon ce qui se lit le mieux sur une couleur de fond donnée. */
export function couleurLisibleSur(fond: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(fond.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

export function police(cle: ClePolice): string {
  return famillePolice(cle);
}
