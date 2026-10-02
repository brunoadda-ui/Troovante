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
