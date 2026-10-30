"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePlus } from "lucide-react";
import f from "@/components/ui/form.module.css";
import { FORMATS_PHOTO, STOCKAGE_DEPOTS } from "@/lib/depot";
import { alleger } from "@/lib/imagesNavigateur";
import { supabase } from "@/lib/supabase";
import { confirmerAjoutPhotos, preparerAjoutPhotos } from "../../../actions";
import s from "../../../admin.module.css";
import { estRedirection } from "./FichePublication";

type Props = { depotId: string; places: number };

/** Ajout de photos à un dépôt : elles partent du navigateur vers le stockage, comme au dépôt. */
export default function AjoutPhotos({ depotId, places }: Props) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, demarrer] = useTransition();
  const router = useRouter();

  const ajouter = (liste: File[]) =>
    demarrer(async () => {
      setErreur(null);
      try {
        if (liste.length > places) {
          setErreur(`Vous pouvez encore ajouter ${places} photo${places > 1 ? "s" : ""}.`);
          return;
        }
        const fichiers = await Promise.all(liste.map(alleger));
        const preparation = await preparerAjoutPhotos(
          depotId,
          fichiers.map((fichier) => ({ type: fichier.type, taille: fichier.size })),
        );
        if (!preparation.ok) {
          setErreur(preparation.message);
          return;
        }

        const stockage = supabase().storage.from(STOCKAGE_DEPOTS);
        for (const [rang, envoi] of preparation.envois.entries()) {
          const { error } = await stockage.uploadToSignedUrl(envoi.chemin, envoi.jeton, fichiers[rang], {
            contentType: fichiers[rang].type,
          });
          if (error) {
            setErreur("Une photo n’a pas pu être envoyée. Vérifiez votre connexion et réessayez.");
            return;
          }
        }

        const reponse = await confirmerAjoutPhotos(
          depotId,
          preparation.envois.map((envoi) => envoi.chemin),
        );
        if (reponse.ok) router.refresh();
        else setErreur(reponse.message);
      } catch (probleme) {
        // Une session expirée renvoie vers la connexion : on laisse Next.js s'en charger.
        if (estRedirection(probleme)) throw probleme;
        setErreur("Le serveur n’a pas répondu. Rechargez la page et réessayez.");
      }
    });

  return (
    <div className={s.ajoutPhotos}>
      <label className={s.ajoutBouton} aria-disabled={enCours}>
        <ImagePlus size={18} aria-hidden />
        <span>{enCours ? "Envoi en cours…" : "Ajouter des photos"}</span>
        <input
          type="file"
          accept={Object.keys(FORMATS_PHOTO).join(",")}
          multiple
          disabled={enCours}
          className="visually-hidden"
          onChange={(evenement) => {
            const liste = Array.from(evenement.target.files ?? []);
            evenement.target.value = "";
            if (liste.length > 0) ajouter(liste);
          }}
        />
      </label>
      {erreur && (
        <p className={f.error} role="alert">
          {erreur}
        </p>
      )}
    </div>
  );
}
