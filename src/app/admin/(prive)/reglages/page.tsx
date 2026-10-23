import type { Metadata } from "next";
import { exigerAdmin } from "@/lib/auth";
import { getUnivers } from "@/lib/catalogue";
import { editionPossible, lireReglages } from "@/lib/reglages/fichier";
import EditeurReglages from "./EditeurReglages";
import s from "./reglages.module.css";

export const metadata: Metadata = { title: "Réglages de l’accueil" };

export default async function PageReglages() {
  await exigerAdmin();
  const [reglages, univers] = await Promise.all([lireReglages(), getUnivers()]);

  // Destinations proposées pour le bouton de la photo et les ambiances.
  const liens = [
    { valeur: "#nouvelles-trouvailles", label: "Nouvelles trouvailles (plus bas sur l’accueil)" },
    ...univers.map((u) => ({ valeur: `/univers/${u.slug}`, label: `Univers : ${u.nom}` })),
    { valeur: "/espace-professionnel", label: "Espace professionnel" },
    { valeur: "/vendre", label: "Vendre un objet" },
    { valeur: "/recherche", label: "Recherche" },
    { valeur: "/favoris", label: "Favoris" },
  ];

  return (
    <div className={`container ${s.page}`}>
      <div className={s.entete}>
        <h1 className={s.titre}>Réglages de l’accueil</h1>
        <p className={s.aide}>
          Chaque rubrique s’enregistre séparément et s’applique aussitôt à l’accueil. Les réglages sont gardés sur cet
          ordinateur, dans le fichier reglages/accueil.json du site.
        </p>
      </div>
      {!editionPossible && (
        <p className={s.avertissement}>
          Les réglages ne se modifient que sur l’ordinateur de travail, quand le site est lancé avec « npm run dev ».
        </p>
      )}
      <EditeurReglages
        reglages={reglages}
        liens={liens}
        univers={univers.map((u) => ({ slug: u.slug, nom: u.nom }))}
        editionPossible={editionPossible}
      />
    </div>
  );
}
