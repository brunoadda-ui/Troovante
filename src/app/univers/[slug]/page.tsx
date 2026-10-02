import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TriSelect from "@/components/Liste/TriSelect";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { getObjetsUnivers, getUniversParSlug, versCarte } from "@/lib/catalogue";
import {
  OBJETS_PAR_PAGE,
  aDesFiltres,
  filtrer,
  lireEtat,
  trier,
  urlListe,
  urlOption,
  type ParametresPage,
} from "@/lib/filtres";
import { formatNombre } from "@/lib/format";
import { slugifier } from "@/lib/slug";
import FilterPanel from "./FilterPanel";
import s from "./univers.module.css";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ParametresPage>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const univers = await getUniversParSlug(slug);
  if (!univers) return {};
  return { title: univers.titre, description: univers.intro };
}

export default async function PageUnivers({ params, searchParams }: Props) {
  const { slug } = await params;
  const univers = await getUniversParSlug(slug);
  if (!univers) notFound();

  const chemin = `/univers/${univers.slug}`;
  const etat = lireEtat(await searchParams, univers.filtres);
  const resultats = trier(filtrer(await getObjetsUnivers(univers.slug), etat), etat.tri);
  const visibles = resultats.slice(0, etat.n);
  const total = resultats.length;

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
          <FilterPanel chemin={chemin} groupes={univers.filtres} etat={etat} />
        </div>

        <div className={s.main}>
          {univers.tuiles.length > 0 && (
            <div className={s.tiles}>
              {univers.tuiles.map((tuile) => {
                const active = (etat.selection[tuile.groupe] ?? []).includes(slugifier(tuile.option));
                return (
                  <Link
                    key={tuile.label}
                    href={urlOption(univers.slug, tuile.groupe, tuile.option)}
                    scroll={false}
                    className={s.tile}
                    aria-current={active ? "true" : undefined}
                  >
                    <Photo
                      src={tuile.image}
                      alt=""
                      legende={tuile.label}
                      ratio="1 / 1"
                      sizes="(min-width: 900px) 20vw, (min-width: 640px) 25vw, 50vw"
                    />
                    <span className={s.tileLabel}>{tuile.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className={s.resultsHead}>
            <div>
              <h2 className={s.resultsTitle}>Liste de résultats</h2>
              <div className={s.resultsCount} role="status">
                {total === 0
                  ? "Aucune pièce ne correspond à ces filtres"
                  : total === 1
                    ? "1 pièce unique, vérifiée par nos experts"
                    : `${formatNombre(total)} pièces uniques, vérifiées par nos experts`}
              </div>
            </div>
            <TriSelect chemin={chemin} etat={etat} />
          </div>

          {total === 0 ? (
            <div className={s.empty}>
              <p>
                {aDesFiltres(etat)
                  ? "Essayez d’élargir la recherche : décochez un filtre ou ajustez la fourchette de prix."
                  : "Les premières pièces de cet univers arrivent bientôt."}
              </p>
              {aDesFiltres(etat) && (
                <Button variant="secondary" href={urlListe(chemin, { tri: etat.tri })} scroll={false}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className={s.grid}>
              {visibles.map((objet) => (
                <ObjetCard
                  key={objet.slug}
                  objet={versCarte(objet)}
                  ratio="1 / 1"
                  sizes="(min-width: 900px) 20vw, (min-width: 640px) 33vw, 50vw"
                  badge="Pièce unique"
                  favori
                />
              ))}
            </div>
          )}

          <div className={s.more}>
            {visibles.length < total && (
              <Button
                variant="secondary"
                size="lg"
                href={urlListe(chemin, { ...etat, n: etat.n + OBJETS_PAR_PAGE })}
                scroll={false}
              >
                Voir plus d’objets
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
