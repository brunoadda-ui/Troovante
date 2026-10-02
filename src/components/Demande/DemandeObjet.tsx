"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { envoyerDemande, type EtatDemande } from "@/app/actions";
import Button from "@/components/ui/Button";
import s from "./Demande.module.css";

type Mode = "achat" | "question";

type Props = {
  slug: string;
  nom: string;
  /** Prix déjà mis en forme, par exemple « 4 800 € ». */
  prix: string;
};

const TEXTES: Record<Mode, { titre: string; intro: string; envoyer: string }> = {
  achat: {
    titre: "Acheter cette pièce",
    intro:
      "Laissez-nous vos coordonnées : nous vous rappelons sous 24 heures ouvrées pour organiser le paiement et la livraison. La pièce n’est réservée qu’après cet échange.",
    envoyer: "Envoyer ma demande d’achat",
  },
  question: {
    titre: "Poser une question au marchand",
    intro: "Écrivez votre question : nous la transmettons au marchand et revenons vers vous sous 24 heures ouvrées.",
    envoyer: "Envoyer ma question",
  },
};

const INITIAL: EtatDemande = { statut: "initial" };

/** Le formulaire est un composant à part : il repart de zéro à chaque ouverture de la fenêtre. */
function Formulaire({ mode, slug, fermer }: { mode: Mode; slug: string; fermer: () => void }) {
  const [etat, envoyer, enCours] = useActionState(envoyerDemande, INITIAL);
  const textes = TEXTES[mode];
  const saisie = etat.statut === "erreur" ? etat.saisie : undefined;

  if (etat.statut === "envoyee") {
    return (
      <div className={s.done}>
        <p className={s.doneTitle}>Merci{etat.prenom ? `, ${etat.prenom}` : ""}. Votre demande est bien partie.</p>
        <p>Nous revenons vers vous sous 24 heures ouvrées, du lundi au samedi.</p>
        <Button variant="secondary" onClick={fermer}>
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <form action={envoyer} className={s.form}>
      <input type="hidden" name="type" value={mode} />
      <input type="hidden" name="objet" value={slug} />
      {/* Piège à robots : invisible et à laisser vide. */}
      <input type="text" name="site_web" tabIndex={-1} autoComplete="off" className={s.trap} aria-hidden="true" />

      <p className={s.intro}>{textes.intro}</p>

      {/* Après un refus, le formulaire se réaffiche avec ce qui avait été saisi. */}
      <label className={s.field}>
        Votre prénom
        <input
          type="text"
          name="prenom"
          required
          maxLength={80}
          autoComplete="given-name"
          defaultValue={saisie?.prenom}
        />
      </label>
      <label className={s.field}>
        Votre e-mail
        <input type="email" name="email" maxLength={160} autoComplete="email" defaultValue={saisie?.email} />
      </label>
      <label className={s.field}>
        Votre téléphone
        <input type="tel" name="telephone" maxLength={30} autoComplete="tel" defaultValue={saisie?.telephone} />
      </label>
      <label className={s.field}>
        {mode === "question" ? "Votre question" : "Un mot pour nous (facultatif)"}
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          required={mode === "question"}
          defaultValue={saisie?.message}
        />
      </label>

      {etat.statut === "erreur" && (
        <p className={s.error} role="alert">
          {etat.message}
        </p>
      )}

      <Button type="submit" size="lg" full disabled={enCours}>
        {enCours ? "Envoi…" : textes.envoyer}
      </Button>
      <p className={s.privacy}>
        Un e-mail ou un téléphone suffit. Vos coordonnées servent uniquement à répondre à cette demande.
      </p>
    </form>
  );
}

/** Les deux boutons de la fiche objet, et la fenêtre de demande qu'ils ouvrent. */
export default function DemandeObjet({ slug, nom, prix }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  // Change à chaque ouverture, pour repartir d'un formulaire vierge.
  const [ouverture, setOuverture] = useState(0);
  const fenetre = useRef<HTMLDialogElement>(null);

  const ouvrir = (choix: Mode) => {
    setMode(choix);
    setOuverture((n) => n + 1);
  };

  useEffect(() => {
    const dialogue = fenetre.current;
    if (!dialogue) return;
    if (mode && !dialogue.open) dialogue.showModal();
    if (!mode && dialogue.open) dialogue.close();
  }, [mode]);

  return (
    <>
      <Button size="lg" full onClick={() => ouvrir("achat")}>
        Acheter — {prix}
      </Button>
      <Button variant="secondary" size="lg" full onClick={() => ouvrir("question")}>
        Poser une question au marchand
      </Button>

      <dialog
        ref={fenetre}
        className={s.dialog}
        aria-labelledby="demande-titre"
        onClose={() => setMode(null)}
        onClick={(e) => {
          // Un clic sur le fond assombri (hors de la fenêtre) la referme.
          if (e.target === e.currentTarget) setMode(null);
        }}
      >
        {mode && (
          <div className={s.panel}>
            <div className={s.head}>
              <h2 id="demande-titre" className={s.title}>
                {TEXTES[mode].titre}
              </h2>
              <button type="button" className={s.close} aria-label="Fermer" onClick={() => setMode(null)}>
                <X size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <p className={s.recap}>
              {nom} · <strong>{prix}</strong>
            </p>
            <Formulaire key={ouverture} mode={mode} slug={slug} fermer={() => setMode(null)} />
          </div>
        )}
      </dialog>
    </>
  );
}
