"use client";

import { useActionState } from "react";
import { envoyerDemande, type EtatDemande } from "@/app/actions";
import Button from "@/components/ui/Button";
import s from "./vendre.module.css";

const INITIAL: EtatDemande = { statut: "initial" };

/** « On vous rappelle » : un prénom, un numéro, et la demande part dans la base. */
export default function RappelForm() {
  const [etat, envoyer, enCours] = useActionState(envoyerDemande, INITIAL);
  // Après un refus, le formulaire se réaffiche avec ce qui avait été saisi.
  const saisie = etat.statut === "erreur" ? etat.saisie : undefined;

  if (etat.statut === "envoyee") {
    return (
      <div className={s.callbackForm} role="status">
        <p className={s.callbackDone}>Merci{etat.prenom ? `, ${etat.prenom}` : ""}. C’est noté.</p>
        <p className={s.callbackLead}>Nous vous appelons très vite, du lundi au samedi entre 9h et 19h.</p>
      </div>
    );
  }

  return (
    <form action={envoyer} className={s.callbackForm}>
      <input type="hidden" name="type" value="rappel" />
      {/* Piège à robots : invisible et à laisser vide. */}
      <input type="text" name="site_web" tabIndex={-1} autoComplete="off" className={s.trap} aria-hidden="true" />
      <label className={s.field}>
        Votre prénom
        <input
          type="text"
          name="prenom"
          placeholder="Marie"
          required
          maxLength={80}
          autoComplete="given-name"
          defaultValue={saisie?.prenom}
        />
      </label>
      <label className={s.field}>
        Votre numéro de téléphone
        <input
          type="tel"
          name="telephone"
          placeholder="06 00 00 00 00"
          required
          maxLength={30}
          autoComplete="tel"
          defaultValue={saisie?.telephone}
        />
      </label>
      {etat.statut === "erreur" && (
        <p className={s.callbackError} role="alert">
          {etat.message}
        </p>
      )}
      <Button type="submit" variant="inverse" size="lg" full disabled={enCours}>
        {enCours ? "Envoi…" : "On vous rappelle"}
      </Button>
    </form>
  );
}
