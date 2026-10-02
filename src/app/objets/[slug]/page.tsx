import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import DemandeObjet from "@/components/Demande/DemandeObjet";
import FavoriButton from "@/components/Favoris/FavoriButton";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import DisclosureRow from "@/components/ui/DisclosureRow";
import Photo from "@/components/ui/Photo";
import { site } from "@/data/site";
import { getDuMemeMarchand, getObjetParSlug, versCarte } from "@/lib/catalogue";
import { urlOption } from "@/lib/filtres";
import { compter, formatPrix } from "@/lib/format";
import type { ObjetComplet } from "@/lib/types";
import s from "./objet.module.css";

type Props = { params: Promise<{ slug: string }> };

const GARANTIES = [
  { Icone: BadgeCheck, texte: "Authenticité et datation vérifiées par nos experts" },
  { Icone: ShieldCheck, texte: "Paiement sécurisé, remboursé sous 14 jours après réception" },
  { Icone: Truck, texte: "Livraison par transporteur spécialisé, emballage sur mesure" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const objet = await getObjetParSlug(slug);
  if (!objet) return {};
  const description = objet.histoire?.split("\n")[0] ?? `${objet.nom} — ${objet.origine}. Pièce unique, vérifiée par nos experts.`;
  return { title: objet.nom, description };
}

/** « Galerie Bertheau — antiquaire à Paris depuis 1987… 9 objets confiés en exclusivité à TROOVANTE. » */
function presenterMarchand(objet: ObjetComplet, nombreObjets: number): string | undefined {
  const marchand = objet.marchand;
  if (!marchand) return undefined;
  const presentation = marchand.presentation
    ? ` — ${marchand.presentation.charAt(0).toLowerCase()}${marchand.presentation.slice(1)}`
    : marchand.ville
      ? ` — ${marchand.ville}.`
      : ".";
  const confies =
    nombreObjets > 1
      ? ` ${compter(nombreObjets, "objet", "objets")} confiés en exclusivité à TROOVANTE.`
      : " Cet objet est confié en exclusivité à TROOVANTE.";
  return `${marchand.nom}${presentation}${confies}`;
}

export default async function PageObjet({ params }: Props) {
  const { slug } = await params;
  const objet = await getObjetParSlug(slug);
  if (!objet) notFound();

  const prix = formatPrix(objet.prix);
  const duMemeMarchand = await getDuMemeMarchand(objet, 500);
  const [photoPrincipale, ...autresPhotos] = objet.photos;

  // Fil d'Ariane : univers, puis la première caractéristique de l'objet (sa catégorie).
  const groupe = objet.univers.filtres[0];
  const categorie = groupe ? objet.attributs[groupe.cle]?.[0] : undefined;

  const provenance = [
    objet.origine,
    objet.signature,
    objet.marchand && [objet.marchand.nom, objet.marchand.ville].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");

  const rubriques = [
    { titre: "Histoire de l’objet", texte: objet.histoire },
    { titre: "Dimensions et poids", texte: objet.dimensions },
    { titre: "État", texte: objet.etat },
    { titre: "Livraison et retours", texte: objet.livraison ?? site.livraisonParDefaut },
    { titre: "Le marchand", texte: presenterMarchand(objet, duMemeMarchand.length + 1) },
  ].filter((rubrique): rubrique is { titre: string; texte: string } => Boolean(rubrique.texte));

  return (
    <>
      <nav className={`container ${s.breadcrumb}`} aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span> / </span>
        <Link href={`/univers/${objet.univers.slug}`} className={s.breadcrumbStep}>
          {objet.univers.nom}
        </Link>
        <span> / </span>
        {groupe && categorie && (
          <>
            <Link href={urlOption(objet.univers.slug, groupe.cle, categorie)} className={s.breadcrumbStep}>
              {categorie}
            </Link>
            <span> / </span>
          </>
        )}
        <span className={s.breadcrumbCurrent}>{objet.nomCourt ?? objet.nom}</span>
      </nav>

      <div className={`container ${s.layout}`}>
        <div className={s.gallery}>
          <Photo
            src={photoPrincipale?.src}
            alt={photoPrincipale?.alt ?? objet.nom}
            legende="Photo à venir"
            ratio="4 / 5"
            sizes="(min-width: 800px) 50vw, 100vw"
            priority
          />
          {autresPhotos.length > 0 && (
            <div className={s.thumbs}>
              {autresPhotos.slice(0, 3).map((photo) => (
                <Photo
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt ?? objet.nom}
                  ratio="1 / 1"
                  sizes="(min-width: 800px) 17vw, 33vw"
                />
              ))}
            </div>
          )}
        </div>

        <div className={s.details}>
          <div className={s.heading}>
            <div className={s.exclusive}>
              <span className={s.exclusiveDot} />
              Exclusivité TROOVANTE
            </div>
            <h1 className={s.title}>{objet.nom}</h1>
            <div className={s.provenance}>{provenance}</div>
          </div>

          <div className={s.priceBlock}>
            <div className={s.price}>{prix}</div>
            <div className={s.priceNote}>
              Emballage et livraison en France inclus · Paiement en 3 fois possible
            </div>
          </div>

          <div className={s.unique}>
            <div className={s.uniqueTitle}>Un seul exemplaire disponible</div>
            <div className={s.uniqueText}>
              Cette pièce n’est proposée que sur TROOVANTE. Une fois vendue, elle disparaît du catalogue : nous ne
              rééditons rien.
            </div>
          </div>

          <div className={s.actions}>
            <DemandeObjet slug={objet.slug} nom={objet.nom} prix={prix} />
            <div className={s.callNote}>Ou appelez-nous au {site.telephone} — nous connaissons l’objet.</div>
            <FavoriButton slug={objet.slug} nom={objet.nom} variante="texte" />
          </div>

          <ul className={s.guarantees}>
            {GARANTIES.map(({ Icone, texte }) => (
              <li key={texte}>
                <Icone size={20} strokeWidth={1.5} aria-hidden="true" />
                <span>{texte}</span>
              </li>
            ))}
          </ul>

          <div>
            {rubriques.map((rubrique, i) => (
              <DisclosureRow key={rubrique.titre} label={rubrique.titre} defaultOpen={i === 0}>
                {rubrique.texte.split(/\n\s*\n/).map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </DisclosureRow>
            ))}
          </div>
        </div>
      </div>

      {duMemeMarchand.length > 0 ? (
        <section className={`container ${s.related}`}>
          <h2 className={s.h2}>Du même marchand</h2>
          <div className={s.relatedGrid}>
            {duMemeMarchand.slice(0, 4).map((autre) => (
              <ObjetCard
                key={autre.slug}
                objet={versCarte(autre, true)}
                ratio="4 / 5"
                sizes="(min-width: 1024px) 25vw, 50vw"
                favori
              />
            ))}
          </div>
        </section>
      ) : (
        <div className={s.related} />
      )}
    </>
  );
}
