/**
 * Fabrique supabase/installation.sql : la structure de la base (schema.sql)
 * suivie du catalogue de démonstration (src/data/demo.ts).
 *
 * À relancer après toute modification de l'un de ces deux fichiers :
 *   node scripts/generer-sql.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { demoMarchands, demoObjets, demoUnivers } from "../src/data/demo.ts";

const racine = new URL("../", import.meta.url);

/** Texte SQL entre apostrophes, ou NULL. */
const texte = (valeur: string | undefined | null) =>
  valeur == null || valeur === "" ? "null" : `'${valeur.replace(/'/g, "''")}'`;

const json = (valeur: unknown) => `${texte(JSON.stringify(valeur))}::jsonb`;

const lignes: string[] = [];

lignes.push(readFileSync(new URL("supabase/schema.sql", racine), "utf8").trimEnd());
lignes.push(
  "",
  "-- =====================================================================",
  "-- Catalogue de démonstration (fictif, repris de la maquette).",
  "-- Un univers, un marchand ou un objet déjà présent n'est pas modifié.",
  "-- =====================================================================",
  "",
);

demoUnivers.forEach((u, position) => {
  // La clé de chaque groupe se déduit de son libellé : inutile de la stocker.
  const filtres = u.filtres.map(({ label, options }) => ({ label, options }));
  lignes.push(
    "insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values",
    `  (${[texte(u.slug), texte(u.nom), texte(u.titre), texte(u.accroche), texte(u.intro), texte(u.image), json(u.tuiles), json(filtres), position].join(", ")})`,
    "  on conflict (slug) do nothing;",
  );
});

lignes.push("");

for (const m of demoMarchands) {
  lignes.push(
    "insert into public.marchands (slug, nom, ville, region, presentation) values",
    `  (${[texte(m.slug), texte(m.nom), texte(m.ville), texte(m.region), texte(m.presentation)].join(", ")})`,
    "  on conflict (slug) do nothing;",
  );
}

lignes.push("");

demoObjets.forEach((o, rang) => {
  lignes.push(
    "insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values",
    `  (${[
      texte(o.slug),
      texte(o.universSlug),
      `(select id from public.marchands where slug = ${texte(o.marchandId)})`,
      texte(o.nom),
      texte(o.nomCourt),
      texte(o.origine),
      texte(o.signature),
      o.prix,
      "'publie'",
      json(o.attributs),
      json(o.photos),
      texte(o.histoire),
      texte(o.dimensions),
      texte(o.etat),
      texte(o.livraison),
      // Même ordre que dans demo.ts : une heure d'écart entre chaque objet.
      `now() - interval '${rang} hours'`,
    ].join(", ")})`,
    "  on conflict (slug) do nothing;",
  );
});

writeFileSync(new URL("supabase/installation.sql", racine), `${lignes.join("\n")}\n`, "utf8");
console.log(
  `supabase/installation.sql : ${demoUnivers.length} univers, ${demoMarchands.length} marchands, ${demoObjets.length} objets.`,
);
