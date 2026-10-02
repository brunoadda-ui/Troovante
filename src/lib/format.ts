const euros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const entier = new Intl.NumberFormat("fr-FR");

/** 4800 → « 4 800 € » */
export function formatPrix(montant: number): string {
  return euros.format(montant);
}

/** 1284 → « 1 284 » */
export function formatNombre(valeur: number): string {
  return entier.format(valeur);
}

/** (12, "objet", "objets") → « 12 objets » ; (1, …) → « 1 objet » ; (0, …) → « Aucun objet ». */
export function compter(valeur: number, singulier: string, pluriel: string): string {
  if (valeur === 0) return `Aucun ${singulier}`;
  return `${formatNombre(valeur)} ${valeur > 1 ? pluriel : singulier}`;
}
