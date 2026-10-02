"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import type { GroupeFiltres } from "@/data/catalogue";
import s from "./univers.module.css";

/**
 * Colonne de filtres. Toujours visible sur ordinateur ; repliée derrière
 * un bouton « Filtres » sur téléphone. Les cases ne filtrent pas encore
 * les résultats : ce sera branché avec le vrai catalogue.
 */
export default function FilterPanel({ groupes }: { groupes: GroupeFiltres[] }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className={s.filters}>
      <div className={s.filtersTitle}>Filtres</div>
      <button
        type="button"
        className={s.filtersToggle}
        aria-expanded={ouvert}
        aria-controls="filtres"
        onClick={() => setOuvert((o) => !o)}
      >
        <span className={s.filtersToggleLabel}>
          <SlidersHorizontal size={18} strokeWidth={1.5} aria-hidden="true" />
          Filtres
        </span>
        <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" className={s.filtersToggleCaret} />
      </button>

      <div id="filtres" className={s.filtersBody} data-open={ouvert}>
        {groupes.map((groupe) => (
          <div key={groupe.label} role="group" aria-label={groupe.label} className={s.filterGroup}>
            <div className={s.filterLegend}>
              <span>{groupe.label}</span>
              <ChevronUp size={18} strokeWidth={1.5} aria-hidden="true" />
            </div>
            {groupe.options.map((option) => (
              <label key={option} className={s.filterOption}>
                <input type="checkbox" name={groupe.label} value={option} />
                {option}
              </label>
            ))}
          </div>
        ))}

        <div role="group" aria-label="Prix" className={`${s.filterGroup} ${s.filterGroupLast}`}>
          <div className={s.filterLegend}>Prix</div>
          <div className={s.priceRow}>
            <input type="text" inputMode="numeric" placeholder="0 €" aria-label="Prix minimum" className={s.priceInput} />
            <span className={s.priceSep}>—</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="5 000 €"
              aria-label="Prix maximum"
              className={s.priceInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
