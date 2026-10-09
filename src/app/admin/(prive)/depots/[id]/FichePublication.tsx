"use client";

import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import f from "@/components/ui/form.module.css";
import type { GroupeFiltres } from "@/lib/types";
import { publierDepot, type EtatAction } from "../../../actions";
import s from "../../../admin.module.css";

export type FicheInitiale = {
  nom: string;
  universSlug: string;
  origine: string;
  signature: string;
  prix: number;
  histoire: string;
  dimensions: string;
  etat: string;
  marchandNom: string;
  marchandVille: string;
};

type Props = {
  depotId: string;
  initiale: FicheInitiale;
  univers: { slug: string; nom: string; filtres: GroupeFiltres[] }[];
  photos: { chemin: string; lien?: string; situation: boolean; cochee: boolean }[];
};

const INITIAL: EtatAction = { statut: "initial" };

/**
 * La fiche telle qu'elle paraîtra sur le site, préremplie avec la saisie du
 * professionnel. TROOVANTE la corrige, choisit les photos, puis publie.
 */
export default function FichePublication({ depotId, initiale, univers, photos }: Props) {
  const [universSlug, setUniversSlug] = useState(initiale.universSlug);
  const [etat, setEtat] = useState<EtatAction>(INITIAL);
  const [enCours, demarrer] = useTransition();
  const groupes = univers.find((u) => u.slug === universSlug)?.filtres ?? [];

  // Envoi « à la main » plutôt que par l'attribut action du formulaire : en cas
  // de refus, les corrections déjà saisies restent en place.
  const publier = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const donnees = new FormData(evenement.currentTarget);
    demarrer(async () => {
      setEtat(await publierDepot(INITIAL, donnees));
    });
  };

  return (
    <form className={s.form} onSubmit={publier}>
      <input type="hidden" name="id" value={depotId} />

      <label className={f.field}>
        Nom de l’objet
        <input type="text" name="nom" required maxLength={160} defaultValue={initiale.nom} />
      </label>

      <div className={s.row2}>
        <label className={f.field}>
          Univers
          <select name="univers" required value={universSlug} onChange={(e) => setUniversSlug(e.target.value)}>
            <option value="" disabled>
              Choisir…
            </option>
            {univers.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.nom}
              </option>
            ))}
          </select>
        </label>
        <label className={f.field}>
          Prix affiché (€)
          <input type="text" inputMode="numeric" name="prix" required maxLength={12} defaultValue={initiale.prix} />
        </label>
      </div>

      {groupes.map((groupe) => (
        <fieldset key={`${universSlug}-${groupe.cle}`} className={s.group}>
          <legend className={s.groupLabel}>
            {groupe.label} <span className={f.optional}>(filtres du site)</span>
          </legend>
          <div className={s.options}>
            {groupe.options.map((option) => (
              <label key={option} className={s.option}>
                <input type="checkbox" name={`attribut:${groupe.cle}`} value={option} />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className={s.row2}>
        <label className={f.field}>
          Époque et origine
          <input type="text" name="origine" required maxLength={200} defaultValue={initiale.origine} />
        </label>
        <label className={f.field}>
          <span>
            Signature ou estampille <span className={f.optional}>(facultatif)</span>
          </span>
          <input type="text" name="signature" maxLength={200} defaultValue={initiale.signature} />
        </label>
      </div>

      <label className={f.field}>
        Histoire de l’objet
        <span className={f.hint}>Une ligne vide sépare deux paragraphes.</span>
        <textarea name="histoire" rows={6} maxLength={4000} defaultValue={initiale.histoire} />
      </label>
      <label className={f.field}>
        Dimensions et poids
        <input type="text" name="dimensions" maxLength={400} defaultValue={initiale.dimensions} />
      </label>
      <label className={f.field}>
        État
        <textarea name="etat" rows={3} maxLength={2000} defaultValue={initiale.etat} />
      </label>

      <div className={s.row2}>
        <label className={f.field}>
          Nom public du marchand ou du créateur
          <span className={f.hint}>Affiché sur la fiche. Un nom déjà connu est réutilisé.</span>
          <input type="text" name="marchand_nom" required maxLength={160} defaultValue={initiale.marchandNom} />
        </label>
        <label className={f.field}>
          <span>
            Ville <span className={f.optional}>(facultatif)</span>
          </span>
          <input type="text" name="marchand_ville" maxLength={120} defaultValue={initiale.marchandVille} />
        </label>
      </div>

      <fieldset className={s.group}>
        <legend className={s.groupLabel}>
          Photos à publier{" "}
          <span className={f.optional}>(les mises en situation passent en premier sur la fiche)</span>
        </legend>
        <div className={s.photos}>
          {photos.map((photo, rang) => (
            <label key={photo.chemin} className={s.pick}>
              <input type="checkbox" name="photo" value={photo.chemin} defaultChecked={photo.cochee} />
              <span className={s.photo}>
                {photo.lien && (
                  <Image
                    src={photo.lien}
                    alt={photo.situation ? `Mise en situation ${rang + 1}` : `Photo d’origine ${rang + 1}`}
                    fill
                    unoptimized
                    sizes="160px"
                    className={s.thumbImg}
                  />
                )}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {etat.statut === "erreur" && (
        <p className={f.error} role="alert">
          {etat.message}
        </p>
      )}

      <div className={s.actions}>
        <Button type="submit" size="lg" disabled={enCours}>
          {enCours ? "Publication…" : "Publier sur le site"}
        </Button>
      </div>
    </form>
  );
}
