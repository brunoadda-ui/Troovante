import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Gem, SearchCheck, Truck } from "lucide-react";
import Visuel from "@/components/Accueil/Visuel";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import FilterChip from "@/components/ui/FilterChip";
import Photo from "@/components/ui/Photo";
import { getChiffres, getNouveautes, getUnivers, versCarte } from "@/lib/catalogue";
import { compter } from "@/lib/format";
import { couleurLisibleSur, police, styleSlogan, styleTexte, tailleFluide } from "@/lib/reglages/css";
import { lireReglages } from "@/lib/reglages/fichier";
import type { CleSection } from "@/lib/reglages/types";
import s from "./page.module.css";

/** Les icônes des trois engagements, dans l'ordre. */
const ICONES_ENGAGEMENTS = [SearchCheck, Gem, Truck];

/**
 * L'accueil. Sa composition (photo d'ouverture, textes, polices, couleurs,
 * sections et leur ordre) vient des réglages modifiables dans /admin/reglages.
 */
export default async function Accueil() {
  const reglages = await lireReglages();
  const { visuel, textes, apparence, sections, barre } = reglages;

  const [univers, nouveautes, chiffres] = await Promise.all([
    getUnivers(),
    getNouveautes(sections.nouveautes.nombre),
    getChiffres(),
  ]);

  // Les chiffres viennent du catalogue réel ; une ligne vide n'est pas affichée.
  const bilan = [
    chiffres.marchands > 0 && compter(chiffres.marchands, "marchand", "marchands"),
    chiffres.regions > 1 && compter(chiffres.regions, "région", "régions"),
    chiffres.objets > 0 && compter(chiffres.objets, "objet exclusif", "objets exclusifs"),
  ].filter((ligne): ligne is string => Boolean(ligne));

  // L'apparence réglée ne s'applique qu'à l'accueil : elle redéfinit les styles du site pour cette page.
  const titres = police(apparence.policeTitres);
  const texteCourant = police(apparence.policeTexte);
  const apparenceAccueil = {
    "--font-campaign": titres,
    "--type-heading-lg": `500 ${tailleFluide(apparence.tailleTitres)} / 1.18 ${titres}`,
    "--type-heading-xl": `500 ${tailleFluide(Math.round(apparence.tailleTitres * 1.35))} / 1.12 ${titres}`,
    "--font-body": texteCourant,
    "--font-ui": texteCourant,
    "--type-body-md": `400 ${apparence.tailleTexte}px / 1.5 ${texteCourant}`,
    "--type-body-strong": `500 ${apparence.tailleTexte}px / 1.5 ${texteCourant}`,
    "--type-caption-md": `500 ${Math.round(apparence.tailleTexte * 0.875)}px / 1.5 ${texteCourant}`,
    "--accent": apparence.couleurAccent,
    "--ink": apparence.couleurTexte,
    color: apparence.couleurTexte,
    background: apparence.couleurFond,
  } as CSSProperties;

  const { surtitre, titre, bouton } = textes;
  const visibles = sections.ordre.filter((cle) => !sections.masquees.includes(cle));
  const derniere = visibles.at(-1);
  const classeSection = (cle: CleSection) => `container ${s.section} ${cle === derniere ? s.sectionLast : ""}`;

  const blocs: Record<CleSection, () => ReactNode> = {
    engagements: () => (
      <div className={`container ${s.engagements}`}>
        {sections.engagements.map(({ titre: titreEngagement, texte }, rang) => {
          const Icone = ICONES_ENGAGEMENTS[rang] ?? SearchCheck;
          return (
            <div key={rang} className={s.engagement}>
              <Icone size={20} strokeWidth={1.5} aria-hidden="true" className={s.engagementIcon} />
              <div>
                <div className={s.engagementTitle}>{titreEngagement}</div>
                <div className={s.engagementText}>{texte}</div>
              </div>
            </div>
          );
        })}
      </div>
    ),

    univers: () => (
      <section className={classeSection("univers")}>
        <h2 className={s.h2}>{sections.univers.titre}</h2>
        <div className={s.chips}>
          {univers.map((u) => (
            <FilterChip key={u.slug} href={`/univers/${u.slug}`}>
              {u.nom}
            </FilterChip>
          ))}
        </div>
      </section>
    ),

    nouveautes: () =>
      nouveautes.length > 0 && (
        <section id="nouvelles-trouvailles" className={`${classeSection("nouveautes")} ${s.ancre}`}>
          <div className={s.sectionHead}>
            <h2 className={s.h2}>{sections.nouveautes.titre}</h2>
            {sections.nouveautes.mentionSemaine && chiffres.nouveautesSemaine > 0 && (
              <span className={s.sectionNote}>
                {chiffres.nouveautesSemaine > 1
                  ? `${chiffres.nouveautesSemaine} objets arrivés cette semaine`
                  : "1 objet arrivé cette semaine"}
              </span>
            )}
          </div>
          <div className={s.productGrid}>
            {nouveautes.map((objet) => (
              <ObjetCard
                key={objet.slug}
                objet={versCarte(objet, true)}
                mention="Pièce unique"
                ratio="4 / 5"
                sizes="(min-width: 1024px) 25vw, 50vw"
                favori
              />
            ))}
          </div>
        </section>
      ),

    styles: () => (
      <section className={classeSection("styles")}>
        <h2 className={s.h2}>{sections.styles.titre}</h2>
        <div className={s.styleGrid}>
          {sections.styles.elements.map((element, rang) => (
            <Link key={rang} href={element.lien} className={s.styleTile}>
              <Photo
                src={element.photo}
                alt={element.titre}
                legende={`Photo d’ambiance — ${element.titre}`}
                ratio="16 / 10"
                sizes="(min-width: 700px) 50vw, 100vw"
              />
              <div className={s.styleText}>
                <div className={s.styleTitle}>{element.titre}</div>
                <div className={s.sectionNote}>{element.texte}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    ),

    marchands: () => (
      <section className={classeSection("marchands")}>
        <div className={s.marchands}>
          <div className={s.marchandsText}>
            {sections.marchands.surtitre && <div className={s.eyebrow}>{sections.marchands.surtitre}</div>}
            <h2 className={s.marchandsTitle}>{sections.marchands.titre}</h2>
            <p className={s.marchandsBody}>{sections.marchands.texte}</p>
            {sections.marchands.chiffres && bilan.length > 0 && (
              <div className={s.stats}>
                {bilan.map((ligne, i) => (
                  <span key={ligne} className={s.stat}>
                    {i > 0 && <span className={s.statSep}>/</span>}
                    {ligne}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Photo
            src={sections.marchands.photo}
            alt="Portrait d’un marchand dans son atelier"
            legende="Portrait d’un marchand dans son atelier, 4:3"
            ratio="4 / 3"
            sizes="(min-width: 700px) 50vw, 100vw"
            className={s.marchandsPhoto}
          />
        </div>
      </section>
    ),
  };

  return (
    <div className={s.accueil} style={apparenceAccueil}>
      <Visuel
        visuel={visuel}
        sousLaBarre={barre.transparente}
        surtitre={surtitre.afficher && surtitre.texte ? { texte: surtitre.texte, css: styleTexte(surtitre.style) } : undefined}
        titre={titre.afficher && titre.texte ? { texte: titre.texte, css: styleSlogan(titre) } : undefined}
        bouton={
          bouton.afficher && bouton.texte
            ? {
                texte: bouton.texte,
                lien: bouton.lien,
                forme: bouton.forme,
                css: styleTexte(bouton.style),
                fond: bouton.style.couleur,
                texteSurFond: couleurLisibleSur(bouton.style.couleur),
              }
            : undefined
        }
      />
      {visibles.map((cle) => (
        <div key={cle}>{blocs[cle]()}</div>
      ))}
    </div>
  );
}
