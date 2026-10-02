import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import DisclosureRow from "@/components/ui/DisclosureRow";
import Photo from "@/components/ui/Photo";
import { getObjetParSlug, getSlugsObjets } from "@/data/catalogue";
import { site } from "@/data/site";
import { formatPrix } from "@/lib/format";
import s from "./objet.module.css";

type Props = { params: Promise<{ slug: string }> };

const ICONES_GARANTIE = {
  authenticite: BadgeCheck,
  paiement: ShieldCheck,
  livraison: Truck,
};

export function generateStaticParams() {
  return getSlugsObjets().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const objet = getObjetParSlug(slug);
  if (!objet) return {};
  return { title: objet.nom, description: objet.rubriques[0]?.paragraphes[0] };
}

export default async function PageObjet({ params }: Props) {
  const { slug } = await params;
  const objet = getObjetParSlug(slug);
  if (!objet) notFound();

  const prix = formatPrix(objet.prix);

  return (
    <>
      <nav className={`container ${s.breadcrumb}`} aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span> / {objet.filAriane.join(" / ")} / </span>
        <span className={s.breadcrumbCurrent}>{objet.nomCourt}</span>
      </nav>

      <div className={`container ${s.layout}`}>
        <div className={s.gallery}>
          <Photo
            src={objet.photoPrincipale.src}
            alt={objet.photoPrincipale.alt}
            legende={objet.photoPrincipale.legende}
            ratio="4 / 5"
            sizes="(min-width: 800px) 50vw, 100vw"
            priority
          />
          <div className={s.thumbs}>
            {objet.photosDetail.map((photo) => (
              <Photo
                key={photo.legende}
                src={photo.src}
                alt={photo.alt}
                legende={photo.legende}
                ratio="1 / 1"
                sizes="(min-width: 800px) 17vw, 33vw"
              />
            ))}
          </div>
        </div>

        <div className={s.details}>
          <div className={s.heading}>
            <div className={s.exclusive}>
              <span className={s.exclusiveDot} />
              Exclusivité TROOVANTE
            </div>
            <h1 className={s.title}>{objet.nom}</h1>
            <div className={s.provenance}>{objet.provenance}</div>
          </div>

          <div className={s.priceBlock}>
            <div className={s.price}>{prix}</div>
            <div className={s.priceNote}>
              Emballage et livraison en France inclus · Paiement en 3 fois possible
            </div>
          </div>

          <div className={s.unique}>
            <div className={s.uniqueTitle}>{objet.exclusivite.titre}</div>
            <div className={s.uniqueText}>{objet.exclusivite.texte}</div>
          </div>

          <div className={s.actions}>
            <Button size="lg" full>
              Acheter — {prix}
            </Button>
            <Button variant="secondary" size="lg" full>
              Poser une question au marchand
            </Button>
            <div className={s.callNote}>Ou appelez-nous au {site.telephone} — nous connaissons l’objet.</div>
          </div>

          <ul className={s.guarantees}>
            {objet.garanties.map((garantie) => {
              const Icone = ICONES_GARANTIE[garantie.icone];
              return (
                <li key={garantie.icone}>
                  <Icone size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span>{garantie.texte}</span>
                </li>
              );
            })}
          </ul>

          <div>
            {objet.rubriques.map((rubrique, i) => (
              <DisclosureRow key={rubrique.titre} label={rubrique.titre} defaultOpen={i === 0}>
                {rubrique.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </DisclosureRow>
            ))}
          </div>
        </div>
      </div>

      <section className={`container ${s.related}`}>
        <h2 className={s.h2}>Du même marchand</h2>
        <div className={s.relatedGrid}>
          {objet.duMemeMarchand.map((autre) => (
            <ObjetCard
              key={autre.nom}
              nom={autre.nom}
              meta={autre.meta}
              prix={formatPrix(autre.prix)}
              ratio="4 / 5"
              legende={autre.legende}
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          ))}
        </div>
      </section>
    </>
  );
}
