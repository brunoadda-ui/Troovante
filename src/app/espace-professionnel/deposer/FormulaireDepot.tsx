"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import f from "@/components/ui/form.module.css";
import { FORMATS_PHOTO, PHOTOS_MAX, PROFILS, STOCKAGE_DEPOTS, TAILLE_PHOTO_MAX } from "@/lib/depot";
import { supabase } from "@/lib/supabase";
import { enregistrerDepot, preparerEnvoi } from "../actions";
import s from "./deposer.module.css";

type PhotoChoisie = { fichier: File; apercu: string };

const COTE_MAX = 2560;

/**
 * Réduit une photo trop lourde avant l'envoi (les téléphones produisent des
 * fichiers de 5 à 10 Mo). En cas de souci, la photo d'origine est gardée.
 */
async function alleger(fichier: File): Promise<File> {
  try {
    const image = await createImageBitmap(fichier, { imageOrientation: "from-image" });
    const echelle = Math.min(1, COTE_MAX / Math.max(image.width, image.height));
    if (echelle === 1 && fichier.size < 3 * 1024 * 1024) {
      image.close();
      return fichier;
    }
    const toile = document.createElement("canvas");
    toile.width = Math.round(image.width * echelle);
    toile.height = Math.round(image.height * echelle);
    const dessin = toile.getContext("2d");
    if (!dessin) return fichier;
    // Fond blanc : une image à fond transparent deviendrait noire en JPEG.
    dessin.fillStyle = "#ffffff";
    dessin.fillRect(0, 0, toile.width, toile.height);
    dessin.drawImage(image, 0, 0, toile.width, toile.height);
    image.close();
    const blob = await new Promise<Blob | null>((fini) => toile.toBlob(fini, "image/jpeg", 0.9));
    if (!blob) return fichier;
    return new File([blob], `${fichier.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return fichier;
  }
}

export default function FormulaireDepot({ univers }: { univers: { slug: string; nom: string }[] }) {
  const [photos, setPhotos] = useState<PhotoChoisie[]>([]);
  const [phase, setPhase] = useState<"saisie" | "envoi" | "termine">("saisie");
  const [avancement, setAvancement] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const hautDePage = useRef<HTMLDivElement>(null);

  const ajouter = async (fichiers: FileList | null) => {
    if (!fichiers) return;
    setErreur(null);
    const places = PHOTOS_MAX - photos.length;
    const nouvelles: PhotoChoisie[] = [];
    for (const fichier of Array.from(fichiers).slice(0, places)) {
      if (!FORMATS_PHOTO[fichier.type]) {
        setErreur("Les photos doivent être au format JPEG, PNG ou WebP.");
        continue;
      }
      const allegee = await alleger(fichier);
      if (allegee.size > TAILLE_PHOTO_MAX) {
        setErreur("Une photo dépasse la taille maximale de 15 Mo.");
        continue;
      }
      nouvelles.push({ fichier: allegee, apercu: URL.createObjectURL(allegee) });
    }
    if (fichiers.length > places) setErreur(`Vous pouvez envoyer ${PHOTOS_MAX} photos au maximum.`);
    setPhotos((actuelles) => [...actuelles, ...nouvelles].slice(0, PHOTOS_MAX));
  };

  const retirer = (rang: number) => {
    URL.revokeObjectURL(photos[rang].apercu);
    setPhotos((actuelles) => actuelles.filter((_, i) => i !== rang));
  };

  const mettreEnPremier = (rang: number) =>
    setPhotos((actuelles) => [actuelles[rang], ...actuelles.filter((_, i) => i !== rang)]);

  const soumettre = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const formulaire = evenement.currentTarget;
    if (photos.length === 0) {
      setErreur("Ajoutez au moins une photo de l’objet.");
      return;
    }

    setErreur(null);
    setPhase("envoi");
    const echec = (message: string) => {
      setErreur(message);
      setPhase("saisie");
    };

    try {
      setAvancement("Préparation de l’envoi…");
      const preparation = await preparerEnvoi(photos.map((p) => ({ type: p.fichier.type, taille: p.fichier.size })));
      if (!preparation.ok) return echec(preparation.message);

      // Les photos partent directement du navigateur vers le stockage, une par une.
      const stockage = supabase().storage.from(STOCKAGE_DEPOTS);
      for (const [rang, envoi] of preparation.envois.entries()) {
        setAvancement(`Envoi de la photo ${rang + 1} sur ${photos.length}…`);
        const { error } = await stockage.uploadToSignedUrl(envoi.chemin, envoi.jeton, photos[rang].fichier, {
          contentType: photos[rang].fichier.type,
        });
        if (error) return echec("Une photo n’a pas pu être envoyée. Vérifiez votre connexion et réessayez.");
      }

      setAvancement("Enregistrement de votre dépôt…");
      const donnees = new FormData(formulaire);
      donnees.set("depotId", preparation.depotId);
      const reponse = await enregistrerDepot(donnees);
      if (!reponse.ok) return echec(reponse.message);

      photos.forEach((p) => URL.revokeObjectURL(p.apercu));
      setPhotos([]);
      setPhase("termine");
      hautDePage.current?.scrollIntoView({ block: "start" });
    } catch {
      echec("Votre dépôt n’a pas pu être envoyé. Vérifiez votre connexion et réessayez.");
    }
  };

  if (phase === "termine") {
    return (
      <div ref={hautDePage} className={s.done} role="status">
        <h2 className={s.doneTitle}>Merci, votre objet est bien reçu.</h2>
        <p>
          Nous retouchons vos photos et mettons l’objet en situation, puis nos experts relisent la fiche. Nous revenons
          vers vous par e-mail ou par téléphone avant la mise en ligne.
        </p>
        <div className={s.doneActions}>
          <Button onClick={() => setPhase("saisie")}>Déposer un autre objet</Button>
          <Button variant="secondary" href="/espace-professionnel">
            Retour à l’espace professionnel
          </Button>
        </div>
      </div>
    );
  }

  const enEnvoi = phase === "envoi";

  return (
    <div ref={hautDePage}>
      <form className={s.form} onSubmit={soumettre}>
        {/* Piège à robots : invisible et à laisser vide. */}
        <input type="text" name="site_web" tabIndex={-1} autoComplete="off" className={f.trap} aria-hidden="true" />

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Vous</h2>
          <div className={s.profils} role="radiogroup" aria-label="Vous êtes">
            {PROFILS.map((profil, i) => (
              <label key={profil.valeur} className={s.profil}>
                <input type="radio" name="profil" value={profil.valeur} defaultChecked={i === 0} required />
                <span>
                  <span className={s.profilLabel}>{profil.label}</span>
                  <span className={f.hint}>{profil.detail}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={s.row2}>
            <label className={f.field}>
              Votre nom
              <input type="text" name="nom" required maxLength={120} autoComplete="name" />
            </label>
            <label className={f.field}>
              <span>
                Société ou atelier <span className={f.optional}>(facultatif)</span>
              </span>
              <input type="text" name="societe" maxLength={160} autoComplete="organization" />
            </label>
          </div>
          <div className={s.row2}>
            <label className={f.field}>
              E-mail
              <input type="email" name="email" required maxLength={160} autoComplete="email" />
            </label>
            <label className={f.field}>
              Téléphone
              <input type="tel" name="telephone" required maxLength={30} autoComplete="tel" />
            </label>
          </div>
          <label className={`${f.field} ${s.half}`}>
            <span>
              Ville <span className={f.optional}>(facultatif)</span>
            </span>
            <input type="text" name="ville" maxLength={120} autoComplete="address-level2" />
          </label>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>L’objet</h2>
          <div className={s.row2}>
            <label className={f.field}>
              Nom de l’objet
              <input type="text" name="titre" required maxLength={160} placeholder="Commode en noyer à façade galbée" />
            </label>
            <label className={f.field}>
              Univers
              <select name="univers" required defaultValue="">
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
          </div>
          <label className={f.field}>
            Description
            <span className={f.hint}>Son histoire, sa fabrication, ce qui le rend singulier. Quelques lignes suffisent.</span>
            <textarea name="description" required rows={5} maxLength={4000} />
          </label>
          <div className={s.row2}>
            <label className={f.field}>
              Époque et origine
              <span className={f.hint}>Lieu et date de fabrication. Pour une création récente, l’année suffit.</span>
              <input type="text" name="origine" required maxLength={200} placeholder="France, vers 1760" />
            </label>
            <label className={f.field}>
              <span>
                Signature ou estampille <span className={f.optional}>(facultatif)</span>
              </span>
              <span className={f.hint}>Telle qu’elle figure sur l’objet.</span>
              <input type="text" name="signature" maxLength={200} />
            </label>
          </div>
          <label className={f.field}>
            État
            <span className={f.hint}>Restaurations, manques, traces d’usage.</span>
            <textarea name="etat" required rows={3} maxLength={2000} />
          </label>
          <div className={s.row4}>
            <label className={f.field}>
              Hauteur (cm)
              <input type="text" inputMode="decimal" name="hauteur" required maxLength={12} />
            </label>
            <label className={f.field}>
              Largeur (cm)
              <input type="text" inputMode="decimal" name="largeur" required maxLength={12} />
            </label>
            <label className={f.field}>
              <span>
                Profondeur (cm) <span className={f.optional}>(facultatif)</span>
              </span>
              <input type="text" inputMode="decimal" name="profondeur" maxLength={12} />
            </label>
            <label className={f.field}>
              <span>
                Poids (kg) <span className={f.optional}>(facultatif)</span>
              </span>
              <input type="text" inputMode="decimal" name="poids" maxLength={12} />
            </label>
          </div>
          <label className={`${f.field} ${s.half}`}>
            Prix de vente souhaité (€)
            <span className={f.hint}>
              C’est le prix affiché sur le site. Notre commission de 5 % est prélevée sur ce prix.
            </span>
            <input type="text" inputMode="numeric" name="prix" required maxLength={12} />
          </label>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Les photos</h2>
          <p className={s.sectionIntro}>
            De 1 à {PHOTOS_MAX} photos. La première est la photo principale : l’objet en entier, net, en lumière
            naturelle si possible. C’est elle que nous retouchons et mettons en situation.
          </p>
          <div className={s.photos}>
            {photos.map((photo, rang) => (
              <div key={photo.apercu} className={s.photo}>
                <Image src={photo.apercu} alt={`Photo ${rang + 1}`} fill unoptimized className={s.photoImg} />
                {rang === 0 ? (
                  <span className={s.photoMain}>Principale</span>
                ) : (
                  <button type="button" className={s.photoFirst} onClick={() => mettreEnPremier(rang)}>
                    Mettre en premier
                  </button>
                )}
                <button
                  type="button"
                  className={s.photoRemove}
                  aria-label={`Retirer la photo ${rang + 1}`}
                  onClick={() => retirer(rang)}
                >
                  <X size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            ))}
            {photos.length < PHOTOS_MAX && (
              <label className={s.photoAdd}>
                <ImagePlus size={24} strokeWidth={1.5} aria-hidden="true" />
                <span>{photos.length === 0 ? "Ajouter des photos" : "Ajouter"}</span>
                <input
                  type="file"
                  accept={Object.keys(FORMATS_PHOTO).join(",")}
                  multiple
                  className="visually-hidden"
                  onChange={(e) => {
                    void ajouter(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>Vos engagements</h2>
          <label className={f.check}>
            <input type="checkbox" name="exclusivite" required />
            <span>
              Je confie cet objet en exclusivité à TROOVANTE : tant qu’il est en ligne sur le site, je ne le propose à
              la vente nulle part ailleurs.
            </span>
          </label>
          <label className={f.check}>
            <input type="checkbox" name="professionnel" required />
            <span>Je suis un professionnel et j’ai le droit de vendre cet objet.</span>
          </label>
        </section>

        {erreur && (
          <p className={f.error} role="alert">
            {erreur}
          </p>
        )}

        <div className={s.submit}>
          <Button type="submit" size="lg" full disabled={enEnvoi}>
            {enEnvoi ? avancement || "Envoi…" : "Envoyer mon objet"}
          </Button>
          <p className={s.privacy}>
            Vos coordonnées servent uniquement au suivi de ce dépôt. Elles ne sont jamais affichées sur le site.
          </p>
        </div>
      </form>
    </div>
  );
}
