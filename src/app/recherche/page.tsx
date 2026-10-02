import type { Metadata } from "next";
import TriSelect from "@/components/Liste/TriSelect";
import ObjetCard from "@/components/ObjetCard/ObjetCard";
import Button from "@/components/ui/Button";
import FilterChip from "@/components/ui/FilterChip";
import SearchPill from "@/components/ui/SearchPill";
import { getObjets, getUnivers, versCarte } from "@/lib/catalogue";
import { OBJETS_PAR_PAGE, lireEtat, rechercher, trier, urlListe, type ParametresPage } from "@/lib/filtres";
import { formatNombre } from "@/lib/format";
import s from "./recherche.module.css";

type Props = { searchParams: Promise<ParametresPage> };

const CHEMIN = "/recherche";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = lireEtat(await searchParams);
  return { title: q ? `Recherche : ${q}` : "Rechercher" };
}

export default async function PageRecherche({ searchParams }: Props) {
  const etat = lireEtat(await searchParams);
  const resultats = etat.q ? trier(rechercher(await getObjets(), etat.q), etat.tri) : [];
  const visibles = resultats.slice(0, etat.n);
  const total = resultats.length;

  return (
    <div className={`container ${s.page}`}>
      <div className={s.head}>
        <h1 className={s.title}>{etat.q ? `Résultats pour « ${etat.q} »` : "Rechercher un objet"}</h1>
        <SearchPill
          key={etat.q}
          placeholder="Un objet, un style, une époque, un marchand"
          valeur={etat.q}
          className={s.search}
        />
      </div>

      {etat.q && total > 0 && (
        <>
          <div className={s.resultsHead}>
            <div className={s.count} role="status">
              {total === 1 ? "1 pièce unique trouvée" : `${formatNombre(total)} pièces uniques trouvées`}
            </div>
            <TriSelect chemin={CHEMIN} etat={etat} />
          </div>

          <div className={s.grid}>
            {visibles.map((objet) => (
              <ObjetCard
                key={objet.slug}
                objet={versCarte(objet, true)}
                ratio="1 / 1"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                badge="Pièce unique"
                favori
              />
            ))}
          </div>

          {visibles.length < total && (
            <div className={s.more}>
              <Button
                variant="secondary"
                size="lg"
                href={urlListe(CHEMIN, { ...etat, n: etat.n + OBJETS_PAR_PAGE })}
                scroll={false}
              >
                Voir plus d’objets
              </Button>
            </div>
          )}
        </>
      )}

      {(!etat.q || total === 0) && (
        <div className={s.empty}>
          <p>
            {etat.q
              ? "Aucune pièce ne correspond à cette recherche. Essayez un mot plus général (« commode », « laiton », « Art déco »), ou parcourez un univers :"
              : "Saisissez un mot ci-dessus, ou parcourez un univers :"}
          </p>
          <div className={s.chips}>
            {(await getUnivers()).map((u) => (
              <FilterChip key={u.slug} href={`/univers/${u.slug}`}>
                {u.nom}
              </FilterChip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
