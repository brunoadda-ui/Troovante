import type { Metadata } from "next";
import Link from "next/link";
import { lienTelephone, site } from "@/data/site";
import { getUnivers } from "@/lib/catalogue";
import FormulaireDepot from "./FormulaireDepot";
import s from "./deposer.module.css";

// Après l'envoi, la mise en situation de l'objet se génère en arrière-plan (jusqu'à une minute).
export const maxDuration = 120;

export const metadata: Metadata = {
  title: "Déposer un objet",
  description: "Formulaire de dépôt d’un objet par un marchand ou un créateur partenaire de TROOVANTE.",
};

/** Les conditions, rappelées à côté du formulaire (détaillées sur la page Espace professionnel). */
const CONDITIONS = [
  { label: "Commission", texte: "5 % du prix de vente, prélevés seulement si l’objet est vendu." },
  { label: "Exclusivité", texte: "Tant qu’il est en ligne chez nous, l’objet n’est proposé nulle part ailleurs." },
  {
    label: "Expédition",
    texte: "À la vente, vous emballez et expédiez la pièce. La livraison est réglée par l’acheteur.",
  },
];

export default async function PageDeposer() {
  const univers = (await getUnivers()).map((u) => ({ slug: u.slug, nom: u.nom, filtres: u.filtres }));

  return (
    <div className={`container ${s.page}`}>
      <nav className={s.breadcrumb} aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span> / </span>
        <Link href="/espace-professionnel">Espace professionnel</Link>
        <span> / </span>
        <span className={s.breadcrumbCurrent}>Déposer un objet</span>
      </nav>

      <div className={s.layout}>
        <aside className={s.aside}>
          <h1 className={s.title}>Déposer un objet</h1>
          <p className={s.lead}>
            Quelques photos et ce que vous savez de la pièce : nous nous chargeons de la retouche, de la mise en
            situation et de la fiche. Rien n’est publié sans la validation de nos experts.
          </p>
          <dl className={s.infos}>
            {CONDITIONS.map((condition) => (
              <div key={condition.label} className={s.info}>
                <dt className={s.infoLabel}>{condition.label}</dt>
                <dd className={s.infoText}>{condition.texte}</dd>
              </div>
            ))}
            <div className={s.info}>
              <dt className={s.infoLabel}>Une question ?</dt>
              <dd className={s.infoText}>
                <a href={lienTelephone(site.telephone)} className={s.infoLink}>
                  {site.telephone}
                </a>
                <a href={`mailto:${site.email}`} className={s.infoLink}>
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
        <FormulaireDepot univers={univers} />
      </div>
    </div>
  );
}
