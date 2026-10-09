import type { Metadata } from "next";
import Link from "next/link";
import { getUnivers } from "@/lib/catalogue";
import FormulaireDepot from "./FormulaireDepot";
import s from "./deposer.module.css";

export const metadata: Metadata = {
  title: "Déposer un objet",
  description: "Formulaire de dépôt d’un objet par un marchand ou un créateur partenaire de TROOVANTE.",
};

export default async function PageDeposer() {
  const univers = (await getUnivers()).map((u) => ({ slug: u.slug, nom: u.nom }));

  return (
    <div className={`container ${s.page}`}>
      <nav className={s.breadcrumb} aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span> / </span>
        <Link href="/espace-professionnel">Espace professionnel</Link>
        <span> / </span>
        <span className={s.breadcrumbCurrent}>Déposer un objet</span>
      </nav>

      <div className={s.inner}>
        <h1 className={s.title}>Déposer un objet</h1>
        <p className={s.lead}>
          Quelques photos et ce que vous savez de la pièce : nous nous chargeons de la retouche, de la mise en
          situation et de la fiche. Rien n’est publié sans la validation de nos experts.
        </p>
        <FormulaireDepot univers={univers} />
      </div>
    </div>
  );
}
