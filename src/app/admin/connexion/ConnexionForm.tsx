"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import f from "@/components/ui/form.module.css";
import { seConnecter, type EtatAction } from "../actions";
import s from "../admin.module.css";

const INITIAL: EtatAction = { statut: "initial" };

export default function ConnexionForm() {
  const [etat, connecter, enCours] = useActionState(seConnecter, INITIAL);

  return (
    <form action={connecter} className={s.loginForm}>
      <label className={f.field}>
        E-mail
        <input type="email" name="email" required autoComplete="username" />
      </label>
      <label className={f.field}>
        Mot de passe
        <input type="password" name="mot_de_passe" required autoComplete="current-password" />
      </label>
      {etat.statut === "erreur" && (
        <p className={f.error} role="alert">
          {etat.message}
        </p>
      )}
      <Button type="submit" size="lg" full disabled={enCours}>
        {enCours ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
