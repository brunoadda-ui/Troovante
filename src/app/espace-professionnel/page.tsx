import type { Metadata } from "next";
import { Camera, Gem, Package, Percent, Ruler, ScrollText, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import { lienTelephone, site } from "@/data/site";
import s from "./espace.module.css";

export const metadata: Metadata = {
  title: "Espace professionnel",
  description:
    "Marchands et créateurs : déposez vos objets sur TROOVANTE. Nous retouchons les photos, mettons l’objet en situation et publions la fiche.",
};

const LIEN_DEPOT = "/espace-professionnel/deposer";

const PUBLICS = [
  {
    titre: "Marchands",
    texte:
      "Antiquaires, galeristes, brocanteurs, spécialistes de pièces signées : mobilier, luminaires, arts de la table, tableaux, objets de curiosité.",
  },
  {
    titre: "Créateurs",
    texte:
      "Artisans d’art, designers, artistes : vos créations d’aujourd’hui, présentées avec le même soin que les pièces anciennes.",
  },
];

const ETAPES = [
  {
    num: "1",
    titre: "Vous déposez l’objet",
    texte:
      "Quelques photos prises avec votre téléphone, les dimensions, le prix souhaité et ce que vous savez de la pièce. Le formulaire se remplit en quelques minutes, sans création de compte.",
  },
  {
    num: "2",
    titre: "Nous retravaillons les photos",
    texte:
      "Nous retouchons vos photos et mettons l’objet en situation dans un décor. L’objet lui-même n’est jamais modifié, et votre photo d’origine reste visible sur la fiche.",
  },
  {
    num: "3",
    titre: "Nos experts valident",
    texte:
      "Nous relisons la description, vérifions l’époque et l’état annoncés, et revenons vers vous s’il manque une information. Rien n’est publié sans cette relecture.",
  },
  {
    num: "4",
    titre: "L’objet est en ligne",
    texte:
      "Il rejoint le catalogue TROOVANTE. À la vente, vous emballez et expédiez la pièce à l’acheteur.",
  },
];

const CONDITIONS = [
  {
    Icone: Percent,
    titre: "5 % à la vente, rien avant",
    texte: "Ni frais d’inscription ni abonnement. Notre commission de 5 % n’est prélevée que si l’objet est vendu.",
  },
  {
    Icone: Gem,
    titre: "Une exclusivité",
    texte:
      "Tant qu’il est en ligne chez nous, l’objet n’est proposé à la vente nulle part ailleurs. C’est la promesse que nous faisons aux acheteurs.",
  },
  {
    Icone: Package,
    titre: "Vous expédiez",
    texte:
      "À la vente, c’est vous qui emballez et expédiez la pièce. Les frais de livraison sont réglés par l’acheteur, en plus du prix.",
  },
];

const A_PREPARER = [
  {
    Icone: Camera,
    titre: "De 1 à 5 photos",
    texte: "L’objet en entier, net, en lumière naturelle si possible. Des détails si vous en avez.",
  },
  { Icone: Ruler, titre: "Les dimensions", texte: "Hauteur, largeur et profondeur en centimètres ; le poids si vous le connaissez." },
  { Icone: Tag, titre: "Le prix souhaité", texte: "Le prix de vente que vous voulez voir affiché sur le site." },
  {
    Icone: ScrollText,
    titre: "Ce que vous savez de la pièce",
    texte: "Son nom, son époque et son origine, une signature éventuelle, son état.",
  },
];

export default function PageEspaceProfessionnel() {
  return (
    <>
      <div className={s.hero}>
        <div className={`container ${s.heroInner}`}>
          <div className={s.eyebrow}>Marchands et créateurs</div>
          <h1 className={s.title}>Espace professionnel</h1>
          <p className={s.lead}>
            Confiez-nous vos pièces. Vous envoyez les photos et les informations ; nous nous chargeons de la retouche,
            de la mise en situation, de la fiche et de la mise en ligne.
          </p>
          <div className={s.heroActions}>
            <Button href={LIEN_DEPOT} size="lg">
              Déposer un objet
            </Button>
          </div>
        </div>
      </div>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>À qui s’adresse cet espace</h2>
        <div className={s.publics}>
          {PUBLICS.map((cible) => (
            <div key={cible.titre} className={s.public}>
              <h3 className={s.publicTitle}>{cible.titre}</h3>
              <p className={s.text}>{cible.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Comment ça se passe</h2>
        <div className={s.steps}>
          {ETAPES.map((etape) => (
            <div key={etape.num} className={s.step}>
              <div className={s.stepNum}>{etape.num}</div>
              <h3 className={s.stepTitle}>{etape.titre}</h3>
              <p className={s.text}>{etape.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Les conditions</h2>
        <div className={s.items}>
          {CONDITIONS.map(({ Icone, titre, texte }) => (
            <div key={titre} className={s.item}>
              <Icone size={24} strokeWidth={1.5} aria-hidden="true" className={s.itemIcon} />
              <div>
                <h3 className={s.itemTitle}>{titre}</h3>
                <p className={s.itemText}>{texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Ce qu’il faut préparer</h2>
        <div className={`${s.items} ${s.items4}`}>
          {A_PREPARER.map(({ Icone, titre, texte }) => (
            <div key={titre} className={s.item}>
              <Icone size={24} strokeWidth={1.5} aria-hidden="true" className={s.itemIcon} />
              <div>
                <h3 className={s.itemTitle}>{titre}</h3>
                <p className={s.itemText}>{texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${s.section} ${s.sectionLast}`}>
        <div className={s.cta}>
          <div className={s.ctaText}>
            <h2 className={s.ctaTitle}>Un premier objet à nous confier ?</h2>
            <p className={s.ctaLead}>
              Le dépôt se fait en ligne, en quelques minutes. Une question avant de vous lancer ? Appelez-nous au{" "}
              <a href={lienTelephone(site.telephone)} className={s.ctaLink}>
                {site.telephone}
              </a>{" "}
              ou écrivez à{" "}
              <a href={`mailto:${site.email}`} className={s.ctaLink}>
                {site.email}
              </a>
              .
            </p>
          </div>
          <div>
            <Button href={LIEN_DEPOT} variant="inverse" size="lg">
              Déposer un objet
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
