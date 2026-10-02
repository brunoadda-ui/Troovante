"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { aDesFiltres, lireEntier, urlListe, type EtatListe } from "@/lib/filtres";
import { slugifier } from "@/lib/slug";
import type { GroupeFiltres } from "@/lib/types";
import s from "./univers.module.css";

type Props = {
  chemin: string;
  groupes: GroupeFiltres[];
  etat: EtatListe;
};

/**
 * Colonne de filtres. Toujours visible sur ordinateur ; repliée derrière un
 * bouton « Filtres » sur téléphone. Chaque case cochée modifie l'adresse de
 * la page : c'est le serveur qui renvoie la liste filtrée.
 */
export default function FilterPanel({ chemin, groupes, etat }: Props) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [, demarrer] = useTransition();
  // Coche la case tout de suite, sans attendre le retour du serveur.
  const [selection, setSelection] = useOptimistic(etat.selection);

  // Tout changement de filtre revient au début de la liste (n remis à zéro).
  const aller = (suite: Partial<EtatListe>) =>
    router.replace(urlListe(chemin, { ...etat, ...suite, n: undefined }), { scroll: false });

  const basculer = (cle: string, option: string) => {
    const cochees = selection[cle] ?? [];
    const suivantes = cochees.includes(option) ? cochees.filter((o) => o !== option) : [...cochees, option];
    const suivante = { ...selection, [cle]: suivantes };
    if (suivantes.length === 0) delete suivante[cle];
    demarrer(() => {
      setSelection(suivante);
      aller({ selection: suivante });
    });
  };

  const appliquerPrix = (formulaire: HTMLFormElement) => {
    const donnees = new FormData(formulaire);
    const prixMin = lireEntier(String(donnees.get("prix_min") ?? ""));
    const prixMax = lireEntier(String(donnees.get("prix_max") ?? ""));
    if (prixMin === etat.prixMin && prixMax === etat.prixMax) return;
    demarrer(() => aller({ prixMin, prixMax }));
  };

  const nombreActifs =
    Object.values(selection).reduce((total, options) => total + options.length, 0) +
    (etat.prixMin != null || etat.prixMax != null ? 1 : 0);

  return (
    <div className={s.filters}>
      <div className={s.filtersTitle}>
        <span>Filtres</span>
        {aDesFiltres(etat) && (
          <Link href={urlListe(chemin, { tri: etat.tri })} scroll={false} className={s.filtersClear}>
            Tout effacer
          </Link>
        )}
      </div>
      <button
        type="button"
        className={s.filtersToggle}
        aria-expanded={ouvert}
        aria-controls="filtres"
        onClick={() => setOuvert((o) => !o)}
      >
        <span className={s.filtersToggleLabel}>
          <SlidersHorizontal size={18} strokeWidth={1.5} aria-hidden="true" />
          Filtres{nombreActifs > 0 ? ` (${nombreActifs})` : ""}
        </span>
        <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" className={s.filtersToggleCaret} />
      </button>

      <div id="filtres" className={s.filtersBody} data-open={ouvert}>
        {groupes.map((groupe) => (
          <div key={groupe.cle} role="group" aria-label={groupe.label} className={s.filterGroup}>
            <div className={s.filterLegend}>
              <span>{groupe.label}</span>
              <ChevronUp size={18} strokeWidth={1.5} aria-hidden="true" />
            </div>
            {groupe.options.map((option) => {
              const valeur = slugifier(option);
              return (
                <label key={valeur} className={s.filterOption}>
                  <input
                    type="checkbox"
                    checked={(selection[groupe.cle] ?? []).includes(valeur)}
                    onChange={() => basculer(groupe.cle, valeur)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        ))}

        <form
          role="group"
          aria-label="Prix"
          className={`${s.filterGroup} ${s.filterGroupLast}`}
          onSubmit={(e) => {
            e.preventDefault();
            appliquerPrix(e.currentTarget);
          }}
        >
          <div className={s.filterLegend}>Prix</div>
          <div className={s.priceRow}>
            <input
              key={`min-${etat.prixMin ?? ""}`}
              type="text"
              inputMode="numeric"
              name="prix_min"
              defaultValue={etat.prixMin ?? ""}
              placeholder="0 €"
              aria-label="Prix minimum, en euros"
              className={s.priceInput}
              onBlur={(e) => e.currentTarget.form && appliquerPrix(e.currentTarget.form)}
            />
            <span className={s.priceSep}>—</span>
            <input
              key={`max-${etat.prixMax ?? ""}`}
              type="text"
              inputMode="numeric"
              name="prix_max"
              defaultValue={etat.prixMax ?? ""}
              placeholder="5 000 €"
              aria-label="Prix maximum, en euros"
              className={s.priceInput}
              onBlur={(e) => e.currentTarget.form && appliquerPrix(e.currentTarget.form)}
            />
          </div>
          {/* Permet de valider avec la touche Entrée. */}
          <button type="submit" className="visually-hidden">
            Appliquer le prix
          </button>
          {aDesFiltres(etat) && (
            <Link href={urlListe(chemin, { tri: etat.tri })} scroll={false} className={s.filtersClearMobile}>
              Tout effacer
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
