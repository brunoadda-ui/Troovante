"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import f from "@/components/ui/form.module.css";
import type { ReponseDepot } from "@/lib/depot";
import { choisirPhotoPrincipale, supprimerPhotoDepot } from "../../../actions";
import s from "../../../admin.module.css";

type Props = {
  depotId: string;
  chemin: string;
  /** Propose de faire de cette photo la photo principale. */
  promouvable?: boolean;
  /** Faux pour la dernière photo de l'objet, qui ne peut pas être retirée. */
  supprimable?: boolean;
};

/** Boutons sous une photo d'un dépôt. Les corrections en cours dans la fiche restent en place. */
export default function ActionsPhoto({ depotId, chemin, promouvable = false, supprimable = true }: Props) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const router = useRouter();

  const lancer = (action: () => Promise<ReponseDepot>) =>
    demarrer(async () => {
      setErreur(null);
      const reponse = await action();
      if (reponse.ok) router.refresh();
      else setErreur(reponse.message);
    });

  return (
    <div className={s.photoActions}>
      {promouvable && (
        <button
          type="button"
          className={s.photoAction}
          disabled={enCours}
          onClick={() => lancer(() => choisirPhotoPrincipale(depotId, chemin))}
        >
          Mettre en principale
        </button>
      )}
      {supprimable && (
        <button
          type="button"
          className={s.photoAction}
          disabled={enCours}
          onClick={() => {
            if (window.confirm("Supprimer définitivement cette photo ?")) {
              lancer(() => supprimerPhotoDepot(depotId, chemin));
            }
          }}
        >
          Supprimer
        </button>
      )}
      {erreur && (
        <p className={f.error} role="alert">
          {erreur}
        </p>
      )}
    </div>
  );
}
