import Image from "next/image";
import Link from "next/link";
import { Gem, SearchCheck, Truck } from "lucide-react";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import FilterChip from "@/components/ui/FilterChip";
import Photo from "@/components/ui/Photo";
import { getNouveautes, getUnivers, lienObjetVedette } from "@/data/catalogue";
import { formatPrix } from "@/lib/format";
import s from "./page.module.css";

const ENGAGEMENTS = [
  {
    Icone: SearchCheck,
    titre: "Vérifié par nos experts",
    texte: "Époque, matériaux et état contrôlés avant mise en ligne.",
  },
  {
    Icone: Gem,
    titre: "Exclusif à TROOVANTE",
    texte: "Un seul exemplaire, vendu ici et nulle part ailleurs.",
  },
  {
    Icone: Truck,
    titre: "Livraison protégée",
    texte: "Transporteur spécialisé, emballage sur mesure, retour 14 jours.",
  },
];

const STYLES = [
  {
    titre: "Art déco",
    texte: "Laque, palissandre et lignes tendues — 68 objets",
    legende: "Photo d’ambiance — salon Art déco, 16:10",
  },
  {
    titre: "Campagne française",
    texte: "Noyer, chêne ciré et faïence — 91 objets",
    legende: "Photo d’ambiance — maison de campagne, 16:10",
  },
];

export default function Accueil() {
  const univers = getUnivers();
  const nouveautes = getNouveautes();

  return (
    <>
      <div className={s.hero}>
        <Image
          src="/images/troovante-hero.png"
          alt="Troovante — le charme du passé, l’élégance du présent"
          width={1398}
          height={1125}
          sizes="100vw"
          priority
          className={s.heroImg}
        />
      </div>

      <div className={`container ${s.intro}`}>
        <p className={s.introText}>
          Chaque objet est choisi, daté et vérifié par nos experts, puis confié à un seul marchand professionnel. Il
          n’existe nulle part ailleurs.
        </p>
        <div className={s.introActions}>
          <Button href="/univers/mobilier">Découvrir la sélection</Button>
          <Link href="/vendre" className={s.textLink}>
            Vendre un objet
          </Link>
        </div>
      </div>

      <div className={`container ${s.engagements}`}>
        {ENGAGEMENTS.map(({ Icone, titre, texte }) => (
          <div key={titre} className={s.engagement}>
            <Icone size={20} strokeWidth={1.5} aria-hidden="true" className={s.engagementIcon} />
            <div>
              <div className={s.engagementTitle}>{titre}</div>
              <div className={s.engagementText}>{texte}</div>
            </div>
          </div>
        ))}
      </div>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Parcourir par univers</h2>
        <div className={s.chips}>
          {univers.map((u) => (
            <FilterChip key={u.slug} href={`/univers/${u.slug}`}>
              {u.nom}
            </FilterChip>
          ))}
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <div className={s.sectionHead}>
          <h2 className={s.h2}>Nouvelles trouvailles</h2>
          <span className={s.sectionNote}>42 objets arrivés cette semaine</span>
        </div>
        <div className={s.productGrid}>
          {nouveautes.map((p) => (
            <ObjetCard
              key={p.nom}
              href={lienObjetVedette}
              nom={p.nom}
              meta={p.meta}
              prix={formatPrix(p.prix)}
              mention="Pièce unique"
              ratio="4 / 5"
              image={p.image}
              legende={p.legende}
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          ))}
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Deux façons d’habiter une pièce</h2>
        <div className={s.styleGrid}>
          {STYLES.map((style) => (
            <Link key={style.titre} href="/univers/mobilier" className={s.styleTile}>
              <Photo alt={style.titre} legende={style.legende} ratio="16 / 10" sizes="(min-width: 700px) 50vw, 100vw" />
              <div className={s.styleText}>
                <div className={s.styleTitle}>{style.titre}</div>
                <div className={s.sectionNote}>{style.texte}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`container ${s.section} ${s.sectionLast}`}>
        <div className={s.marchands}>
          <div className={s.marchandsText}>
            <div className={s.eyebrow}>Nos marchands</div>
            <h2 className={s.marchandsTitle}>Des professionnels choisis un par un</h2>
            <p className={s.marchandsBody}>
              Antiquaires, galeristes et brocanteurs installés depuis des années. Nous visitons chaque marchand, nous
              validons chaque provenance, et nous n’acceptons que des objets qu’ils nous confient en exclusivité.
            </p>
            <div className={s.stats}>
              <span>48 marchands</span>
              <span className={s.statSep}>/</span>
              <span>11 régions</span>
              <span className={s.statSep}>/</span>
              <span>1 200 objets exclusifs</span>
            </div>
          </div>
          <Photo
            alt="Portrait d’un marchand dans son atelier"
            legende="Portrait d’un marchand dans son atelier, 4:3"
            ratio="4 / 3"
            sizes="(min-width: 700px) 50vw, 100vw"
            className={s.marchandsPhoto}
          />
        </div>
      </section>
    </>
  );
}
