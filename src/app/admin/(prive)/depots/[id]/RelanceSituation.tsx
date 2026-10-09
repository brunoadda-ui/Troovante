"use client";

import { useTransition } from "react";
import Button from "@/components/ui/Button";
import f from "@/components/ui/form.module.css";
import { relancerMiseEnSituation } from "../../../actions";
import s from "../../../admin.module.css";

type Props = {
  depotId: string;
  decors: { cle: string; label: string }[];
  decorParDefaut: string;
  /** Vrai si une image a déjà été générée : le bouton propose alors d'en refaire une. */
  dejaFaite: boolean;
};

/** Choix du décor et lancement de la mise en situation. La génération prend jusqu'à une minute. */
export default function RelanceSituation({ depotId, decors, decorParDefaut, dejaFaite }: Props) {
  const [enCours, demarrer] = useTransition();

  return (
    <form
      className={s.relance}
      onSubmit={(evenement) => {
        evenement.preventDefault();
        const donnees = new FormData(evenement.currentTarget);
        demarrer(() => relancerMiseEnSituation(donnees));
      }}
    >
      <input type="hidden" name="id" value={depotId} />
      <label className={f.field}>
        Décor
        <select name="decor" defaultValue={decorParDefaut} disabled={enCours}>
          {decors.map((decor) => (
            <option key={decor.cle} value={decor.cle}>
              {decor.label}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="secondary" disabled={enCours}>
        {enCours ? "Génération en cours…" : dejaFaite ? "Générer une autre image" : "Générer la mise en situation"}
      </Button>
      {enCours && <p className={s.muted}>Cela peut prendre jusqu’à une minute. Gardez cette page ouverte.</p>}
    </form>
  );
}
