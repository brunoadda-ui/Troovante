import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { getUnivers, getUniversParSlug, lienObjetVedette } from "@/data/catalogue";
import { formatNombre, formatPrix } from "@/lib/format";
import FilterPanel from "./FilterPanel";
import s from "./univers.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getUnivers().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const univers = getUniversParSlug(slug);
  if (!univers) return {};
  return { title: univers.titre, description: univers.intro };
}

export default async function PageUnivers({ params }: Props) {
  const { slug } = await params;
  const univers = getUniversParSlug(slug);
  if (!univers) notFound();

  return (
    <div className={`container ${s.page}`}>
      <nav className={s.breadcrumb} aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span> / </span>
        <span className={s.breadcrumbCurrent}>{univers.titre}</span>
      </nav>

      <div className={s.layout}>
        <div className={s.side}>
          <div className={s.titleBlock}>
            <h1 className={s.title}>{univers.titre}</h1>
            <div className={s.tagline}>{univers.accroche}</div>
            <p className={s.introText}>{univers.intro}</p>
          </div>
          <FilterPanel groupes={univers.filtres} />
        </div>

        <div className={s.main}>
          <div className={s.tiles}>
            {univers.tuiles.map((tuile) => (
              // Les sous-univers filtreront la liste une fois le vrai catalogue branché.
              <Link key={tuile.label} href={`/univers/${univers.slug}`} className={s.tile}>
                <Photo
                  src={tuile.image}
                  alt={tuile.label}
                  legende={tuile.label}
                  ratio="1 / 1"
                  sizes="(min-width: 900px) 20vw, (min-width: 640px) 25vw, 50vw"
                />
                <span className={s.tileLabel}>{tuile.label}</span>
              </Link>
            ))}
          </div>

          <div className={s.resultsHead}>
            <div>
              <h2 className={s.resultsTitle}>Liste de résultats</h2>
              <div className={s.resultsCount}>
                {formatNombre(univers.nombreObjets)} pièces uniques, vérifiées par nos experts
              </div>
            </div>
            <select className={s.sort} aria-label="Trier les résultats" defaultValue="Pertinence">
              <option>Pertinence</option>
              <option>Nouveautés</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          <div className={s.grid}>
            {univers.objets.map((objet) => (
              <ObjetCard
                key={objet.nom}
                href={lienObjetVedette}
                nom={objet.nom}
                meta={`${objet.origine} · ${objet.marchand}`}
                prix={formatPrix(objet.prix)}
                ratio="1 / 1"
                image={objet.image}
                legende={`${objet.nom} — fond gris clair, carré`}
                sizes="(min-width: 900px) 20vw, (min-width: 640px) 33vw, 50vw"
                badge="Pièce unique"
                favori
              />
            ))}
          </div>

          <div className={s.more}>
            <Button variant="secondary" size="lg">
              Voir plus d’objets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
