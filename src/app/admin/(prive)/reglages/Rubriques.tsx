"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import f from "@/components/ui/form.module.css";
import { alleger, dimensions } from "@/lib/imagesNavigateur";
import {
  FORMES_BOUTON,
  GRAISSES,
  HAUTEURS,
  LIEN_ESPACE_PRO,
  POSITIONS,
  SECTIONS,
  TRANSITIONS,
  type CleSection,
  type Graisse,
  type PhotoAccueil,
  type ReglagesApparence,
  type ReglagesBarre,
  type ReglagesSections,
  type ReglagesTextes,
  type ReglagesVisuel,
} from "@/lib/reglages/types";
import { Case, Choix, ChoixPolice, Couleur, Curseur, EditeurStyle, LigneOrdonnee, Texte, deplacer } from "./Champs";
import s from "./reglages.module.css";

/** Les cinq rubriques du formulaire. Chacune ne fait que modifier son brouillon. */

export type OptionLien = { valeur: string; label: string };

type Editeur<T> = { valeur: T; onChange: (v: T) => void };

// ---------------------------------------------------------------------------
// Envoi d'une photo
// ---------------------------------------------------------------------------

/** Réduit la photo si elle est lourde, l'envoie au site, et renvoie son adresse et sa taille. */
async function envoyerPhoto(fichier: File): Promise<{ src: string; largeur: number; hauteur: number }> {
  const legere = await alleger(fichier);
  const taille = await dimensions(legere);
  const donnees = new FormData();
  donnees.set("photo", legere);
  const reponse = await fetch("/api/admin/photo-accueil", { method: "POST", body: donnees });
  const corps = (await reponse.json().catch(() => ({}))) as { src?: string; message?: string };
  if (!reponse.ok || !corps.src) throw new Error(corps.message ?? "La photo n’a pas pu être envoyée.");
  return { src: corps.src, ...taille };
}

function BoutonPhoto({
  libelle,
  multiple,
  onPhotos,
}: {
  libelle: string;
  multiple?: boolean;
  onPhotos: (photos: { src: string; largeur: number; hauteur: number; nom: string }[]) => void;
}) {
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  return (
    <div className={s.envoi}>
      <label className={s.boutonEnvoi} aria-disabled={enCours}>
        <ImagePlus size={18} strokeWidth={1.5} aria-hidden="true" />
        {enCours ? "Envoi…" : libelle}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="visually-hidden"
          disabled={enCours}
          onChange={async (e) => {
            const fichiers = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (fichiers.length === 0) return;
            setEnCours(true);
            setErreur(null);
            try {
              const envoyees = [];
              for (const fichier of fichiers) {
                envoyees.push({ ...(await envoyerPhoto(fichier)), nom: fichier.name.replace(/\.[^.]+$/, "") });
              }
              onPhotos(envoyees);
            } catch (probleme) {
              setErreur(probleme instanceof Error ? probleme.message : "La photo n’a pas pu être envoyée.");
            } finally {
              setEnCours(false);
            }
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

// ---------------------------------------------------------------------------
// 1. Photo d'ouverture
// ---------------------------------------------------------------------------

/** Vignette d'une photo : un clic dessus place le point de cadrage (la partie à garder visible). */
function Vignette({ photo, onCadrage }: { photo: PhotoAccueil; onCadrage: (x: number, y: number) => void }) {
  return (
    <button
      type="button"
      className={s.vignette}
      style={{ aspectRatio: `${photo.largeur} / ${photo.hauteur}` }}
      title="Cliquer pour choisir la partie de la photo à garder visible"
      onClick={(e) => {
        const cadre = e.currentTarget.getBoundingClientRect();
        onCadrage(
          Math.round(((e.clientX - cadre.left) / cadre.width) * 100),
          Math.round(((e.clientY - cadre.top) / cadre.height) * 100),
        );
      }}
    >
      <Image src={photo.src} alt="" fill sizes="240px" className={s.vignetteImage} />
      <span className={s.mire} style={{ left: `${photo.cadrageX}%`, top: `${photo.cadrageY}%` }} aria-hidden="true" />
    </button>
  );
}

export function EditeurVisuel({ valeur, onChange }: Editeur<ReglagesVisuel>) {
  const maj = (partiel: Partial<ReglagesVisuel>) => onChange({ ...valeur, ...partiel });
  const majPhoto = (rang: number, partiel: Partial<PhotoAccueil>) =>
    maj({ photos: valeur.photos.map((p, i) => (i === rang ? { ...p, ...partiel } : p)) });
  const diaporama = valeur.diaporama;
  const majDiaporama = (partiel: Partial<ReglagesVisuel["diaporama"]>) => maj({ diaporama: { ...diaporama, ...partiel } });

  return (
    <>
      <fieldset className={s.groupe}>
        <legend>Photos</legend>
        <p className={s.aide}>
          La première photo s’affiche seule si le diaporama est désactivé. Cliquez sur une vignette pour choisir la
          partie à garder visible quand la photo est recadrée (sur téléphone notamment).
        </p>
        {valeur.photos.map((photo, rang) => (
          <LigneOrdonnee
            key={photo.src + rang}
            rang={rang}
            total={valeur.photos.length}
            deplacer={(de, vers) => maj({ photos: deplacer(valeur.photos, de, vers) })}
            retirer={valeur.photos.length > 1 ? () => maj({ photos: valeur.photos.filter((_, i) => i !== rang) }) : undefined}
          >
            <div className={s.photoLigne}>
              <Vignette photo={photo} onCadrage={(cadrageX, cadrageY) => majPhoto(rang, { cadrageX, cadrageY })} />
              <Texte
                label="Description de la photo"
                aide="Lue par les lecteurs d’écran et les moteurs de recherche."
                valeur={photo.alt}
                max={200}
                onChange={(alt) => majPhoto(rang, { alt })}
              />
            </div>
          </LigneOrdonnee>
        ))}
        {valeur.photos.length < 8 && (
          <BoutonPhoto
            libelle="Ajouter des photos"
            multiple
            onPhotos={(nouvelles) =>
              maj({
                photos: [
                  ...valeur.photos,
                  ...nouvelles.map((p) => ({
                    src: p.src,
                    alt: "",
                    largeur: p.largeur,
                    hauteur: p.hauteur,
                    cadrageX: 50,
                    cadrageY: 50,
                  })),
                ].slice(0, 8),
              })
            }
          />
        )}
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Diaporama</legend>
        <Case
          label="Faire défiler les photos"
          valeur={diaporama.actif}
          onChange={(actif) => majDiaporama({ actif })}
        />
        {diaporama.actif && valeur.photos.length < 2 && (
          <p className={s.aide}>Ajoutez au moins une deuxième photo pour que le diaporama défile.</p>
        )}
        <Curseur label="Durée par photo" valeur={diaporama.duree} min={3} max={15} unite=" s" onChange={(duree) => majDiaporama({ duree })} />
        <Choix label="Effet de transition" valeur={diaporama.transition} options={TRANSITIONS} onChange={(transition) => majDiaporama({ transition })} />
        <div className={s.cases}>
          <Case label="Points" valeur={diaporama.points} onChange={(points) => majDiaporama({ points })} />
          <Case label="Flèches" valeur={diaporama.fleches} onChange={(fleches) => majDiaporama({ fleches })} />
          <Case label="Pause au survol" valeur={diaporama.pauseSurvol} onChange={(pauseSurvol) => majDiaporama({ pauseSurvol })} />
        </div>
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Cadre et texte</legend>
        <Choix label="Hauteur" valeur={valeur.hauteur} options={HAUTEURS} onChange={(hauteur) => maj({ hauteur })} />
        <Choix label="Position du texte" valeur={valeur.position} options={POSITIONS} onChange={(position) => maj({ position })} />
        <Curseur label="Voile sombre sous le texte" valeur={valeur.voile} min={0} max={90} unite=" %" onChange={(voile) => maj({ voile })} />
      </fieldset>
    </>
  );
}

// ---------------------------------------------------------------------------
// 2. Texte sur la photo
// ---------------------------------------------------------------------------

export function EditeurTextes({ valeur, onChange, liens }: Editeur<ReglagesTextes> & { liens: OptionLien[] }) {
  const { surtitre, titre, bouton } = valeur;
  const majSlogan = (partiel: Partial<typeof titre>) => onChange({ ...valeur, titre: { ...titre, ...partiel } });
  return (
    <>
      <fieldset className={s.groupe}>
        <legend>Slogan</legend>
        <p className={s.aide}>La grande phrase posée sur la photo. Elle sert aussi de titre à l’onglet du navigateur.</p>
        <Case label="Afficher le slogan" valeur={titre.afficher} onChange={(afficher) => majSlogan({ afficher })} />
        <Texte
          label="Texte du slogan"
          aide="Un retour à la ligne ici crée un retour à la ligne sur la photo."
          multiligne
          valeur={titre.texte}
          max={200}
          onChange={(texte) => majSlogan({ texte })}
        />
        <EditeurStyle valeur={titre.style} tailleMax={120} onChange={(style) => majSlogan({ style })} />
        <Curseur
          label="Interligne"
          valeur={titre.interligne}
          min={70}
          max={200}
          pas={5}
          afficher={(v) => (v / 100).toFixed(2).replace(".", ",")}
          onChange={(interligne) => majSlogan({ interligne })}
        />
        <Curseur
          label="Largeur maximale d’une ligne"
          valeur={titre.largeur}
          min={10}
          max={80}
          afficher={(v) => `${v} caractères`}
          onChange={(largeur) => majSlogan({ largeur })}
        />
        <Curseur
          label="Ombre derrière les lettres"
          valeur={titre.ombre}
          min={0}
          max={100}
          pas={5}
          afficher={(v) => (v === 0 ? "aucune" : `${v} %`)}
          onChange={(ombre) => majSlogan({ ombre })}
        />
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Surtitre</legend>
        <p className={s.aide}>La petite ligne au-dessus du slogan.</p>
        <Case label="Afficher le surtitre" valeur={surtitre.afficher} onChange={(afficher) => onChange({ ...valeur, surtitre: { ...surtitre, afficher } })} />
        <Texte label="Texte" valeur={surtitre.texte} max={120} onChange={(texte) => onChange({ ...valeur, surtitre: { ...surtitre, texte } })} />
        <EditeurStyle valeur={surtitre.style} tailleMax={40} onChange={(style) => onChange({ ...valeur, surtitre: { ...surtitre, style } })} />
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Bouton</legend>
        <Case label="Afficher le bouton" valeur={bouton.afficher} onChange={(afficher) => onChange({ ...valeur, bouton: { ...bouton, afficher } })} />
        <Texte label="Texte" valeur={bouton.texte} max={60} onChange={(texte) => onChange({ ...valeur, bouton: { ...bouton, texte } })} />
        <div className={s.ligne2}>
          <Choix label="Mène à" valeur={bouton.lien} options={avecValeurActuelle(liens, bouton.lien)} onChange={(lien) => onChange({ ...valeur, bouton: { ...bouton, lien } })} />
          <Choix label="Forme" valeur={bouton.forme} options={FORMES_BOUTON} onChange={(forme) => onChange({ ...valeur, bouton: { ...bouton, forme } })} />
        </div>
        <EditeurStyle valeur={bouton.style} tailleMax={32} onChange={(style) => onChange({ ...valeur, bouton: { ...bouton, style } })} />
      </fieldset>
    </>
  );
}

/** La liste des destinations, complétée par la destination actuelle si elle n'y figure pas. */
function avecValeurActuelle(liens: OptionLien[], actuel: string): OptionLien[] {
  return liens.some((l) => l.valeur === actuel) ? liens : [{ valeur: actuel, label: actuel }, ...liens];
}

// ---------------------------------------------------------------------------
// 3. Apparence de l'accueil
// ---------------------------------------------------------------------------

export function EditeurApparence({ valeur, onChange }: Editeur<ReglagesApparence>) {
  const maj = (partiel: Partial<ReglagesApparence>) => onChange({ ...valeur, ...partiel });
  return (
    <>
      <fieldset className={s.groupe}>
        <legend>Titres des sections</legend>
        <p className={s.aide}>
          Les titres placés sous la photo (« Nouvelles trouvailles », « Parcourir par univers »…). Le slogan se règle dans
          l’onglet « Slogan et textes ».
        </p>
        <ChoixPolice label="Police" valeur={valeur.policeTitres} onChange={(policeTitres) => maj({ policeTitres })} />
        <Curseur label="Taille" valeur={valeur.tailleTitres} min={16} max={64} unite=" px" onChange={(tailleTitres) => maj({ tailleTitres })} />
      </fieldset>
      <fieldset className={s.groupe}>
        <legend>Texte courant</legend>
        <ChoixPolice label="Police" valeur={valeur.policeTexte} onChange={(policeTexte) => maj({ policeTexte })} />
        <Curseur label="Taille" valeur={valeur.tailleTexte} min={12} max={22} unite=" px" onChange={(tailleTexte) => maj({ tailleTexte })} />
      </fieldset>
      <fieldset className={s.groupe}>
        <legend>Couleurs</legend>
        <Couleur label="Couleur d’accent (mentions « Pièce unique », chiffres)" valeur={valeur.couleurAccent} onChange={(couleurAccent) => maj({ couleurAccent })} />
        <Couleur label="Couleur du texte" valeur={valeur.couleurTexte} onChange={(couleurTexte) => maj({ couleurTexte })} />
        <Couleur label="Couleur de fond" valeur={valeur.couleurFond} onChange={(couleurFond) => maj({ couleurFond })} />
      </fieldset>
    </>
  );
}

// ---------------------------------------------------------------------------
// 4. Sections
// ---------------------------------------------------------------------------

function PhotoSection({ photo, onChange }: { photo?: string; onChange: (photo?: string) => void }) {
  return (
    <div className={s.photoSection}>
      {photo && (
        <div className={s.photoSectionApercu}>
          <Image src={photo} alt="" fill sizes="160px" className={s.vignetteImage} />
        </div>
      )}
      <BoutonPhoto libelle={photo ? "Remplacer la photo" : "Ajouter une photo"} onPhotos={([p]) => p && onChange(p.src)} />
      {photo && (
        <button type="button" className={s.lienDiscret} onClick={() => onChange(undefined)}>
          Retirer la photo
        </button>
      )}
    </div>
  );
}

export function EditeurSections({ valeur, onChange, liens }: Editeur<ReglagesSections> & { liens: OptionLien[] }) {
  const maj = (partiel: Partial<ReglagesSections>) => onChange({ ...valeur, ...partiel });
  const libelle = (cle: CleSection) => SECTIONS.find((x) => x.cle === cle)?.label ?? cle;
  const basculer = (cle: CleSection, afficher: boolean) =>
    maj({ masquees: afficher ? valeur.masquees.filter((c) => c !== cle) : [...valeur.masquees, cle] });

  return (
    <>
      <fieldset className={s.groupe}>
        <legend>Ordre et affichage</legend>
        <p className={s.aide}>Les sections s’affichent sous la photo d’ouverture, dans cet ordre.</p>
        {valeur.ordre.map((cle, rang) => (
          <LigneOrdonnee key={cle} rang={rang} total={valeur.ordre.length} deplacer={(de, vers) => maj({ ordre: deplacer(valeur.ordre, de, vers) })}>
            <Case label={libelle(cle)} valeur={!valeur.masquees.includes(cle)} onChange={(afficher) => basculer(cle, afficher)} />
          </LigneOrdonnee>
        ))}
      </fieldset>

      <details className={s.details}>
        <summary>Les trois engagements</summary>
        {valeur.engagements.map((e, rang) => (
          <div key={rang} className={s.sousGroupe}>
            <Texte
              label={`Engagement ${rang + 1} — titre`}
              valeur={e.titre}
              max={80}
              onChange={(titre) => maj({ engagements: valeur.engagements.map((x, i) => (i === rang ? { ...x, titre } : x)) })}
            />
            <Texte
              label="Texte"
              valeur={e.texte}
              max={200}
              onChange={(texte) => maj({ engagements: valeur.engagements.map((x, i) => (i === rang ? { ...x, texte } : x)) })}
            />
          </div>
        ))}
      </details>

      <details className={s.details}>
        <summary>Parcourir par univers</summary>
        <Texte label="Titre" valeur={valeur.univers.titre} max={120} onChange={(titre) => maj({ univers: { titre } })} />
      </details>

      <details className={s.details}>
        <summary>Nouvelles trouvailles</summary>
        <Texte label="Titre" valeur={valeur.nouveautes.titre} max={120} onChange={(titre) => maj({ nouveautes: { ...valeur.nouveautes, titre } })} />
        <Curseur label="Nombre d’objets montrés" valeur={valeur.nouveautes.nombre} min={2} max={24} onChange={(nombre) => maj({ nouveautes: { ...valeur.nouveautes, nombre } })} />
        <Case
          label="Afficher « … objets arrivés cette semaine »"
          valeur={valeur.nouveautes.mentionSemaine}
          onChange={(mentionSemaine) => maj({ nouveautes: { ...valeur.nouveautes, mentionSemaine } })}
        />
      </details>

      <details className={s.details}>
        <summary>Deux façons d’habiter une pièce</summary>
        <Texte label="Titre de la section" valeur={valeur.styles.titre} max={120} onChange={(titre) => maj({ styles: { ...valeur.styles, titre } })} />
        {valeur.styles.elements.map((el, rang) => {
          const majEl = (partiel: Partial<typeof el>) =>
            maj({ styles: { ...valeur.styles, elements: valeur.styles.elements.map((x, i) => (i === rang ? { ...x, ...partiel } : x)) } });
          return (
            <div key={rang} className={s.sousGroupe}>
              <Texte label={`Ambiance ${rang + 1} — titre`} valeur={el.titre} max={80} onChange={(titre) => majEl({ titre })} />
              <Texte label="Texte" valeur={el.texte} max={200} onChange={(texte) => majEl({ texte })} />
              <Choix label="Mène à" valeur={el.lien} options={avecValeurActuelle(liens, el.lien)} onChange={(lien) => majEl({ lien })} />
              <PhotoSection photo={el.photo} onChange={(photo) => majEl({ photo })} />
            </div>
          );
        })}
      </details>

      <details className={s.details}>
        <summary>Nos marchands</summary>
        <Texte label="Surtitre" valeur={valeur.marchands.surtitre} max={80} onChange={(surtitre) => maj({ marchands: { ...valeur.marchands, surtitre } })} />
        <Texte label="Titre" valeur={valeur.marchands.titre} max={160} onChange={(titre) => maj({ marchands: { ...valeur.marchands, titre } })} />
        <Texte label="Texte" multiligne valeur={valeur.marchands.texte} max={600} onChange={(texte) => maj({ marchands: { ...valeur.marchands, texte } })} />
        <Case
          label="Afficher les chiffres (marchands, objets)"
          valeur={valeur.marchands.chiffres}
          onChange={(chiffres) => maj({ marchands: { ...valeur.marchands, chiffres } })}
        />
        <PhotoSection photo={valeur.marchands.photo} onChange={(photo) => maj({ marchands: { ...valeur.marchands, photo } })} />
      </details>
    </>
  );
}

// ---------------------------------------------------------------------------
// 5. Barre de navigation
// ---------------------------------------------------------------------------

export function EditeurBarre({
  valeur,
  onChange,
  univers,
}: Editeur<ReglagesBarre> & { univers: { slug: string; nom: string }[] }) {
  const maj = (partiel: Partial<ReglagesBarre>) => onChange({ ...valeur, ...partiel });

  // Tous les liens possibles figurent dans la liste, même ceux absents des réglages.
  const liens = [...valeur.liens];
  for (const u of univers) if (!liens.some((l) => l.cle === u.slug)) liens.push({ cle: u.slug, afficher: true });
  if (!liens.some((l) => l.cle === LIEN_ESPACE_PRO)) liens.push({ cle: LIEN_ESPACE_PRO, afficher: true });
  const libelle = (cle: string) => (cle === LIEN_ESPACE_PRO ? "Espace professionnel" : (univers.find((u) => u.slug === cle)?.nom ?? cle));

  return (
    <>
      <fieldset className={s.groupe}>
        <legend>Sur l’accueil</legend>
        <Case label="Barre transparente, posée sur la photo" valeur={valeur.transparente} onChange={(transparente) => maj({ transparente })} />
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Liens affichés</legend>
        <p className={s.aide}>
          La barre est commune à tout le site : ces liens changent sur toutes les pages. Pour renommer une catégorie,
          écrivez son nouveau titre ; laissez la case vide pour garder le nom d’origine.
        </p>
        {liens.map((lien, rang) => (
          <LigneOrdonnee key={lien.cle} rang={rang} total={liens.length} deplacer={(de, vers) => maj({ liens: deplacer(liens, de, vers) })}>
            <div className={s.lienBarre}>
              <Case
                label={libelle(lien.cle)}
                valeur={lien.afficher}
                onChange={(afficher) => maj({ liens: liens.map((l, i) => (i === rang ? { ...l, afficher } : l)) })}
              />
              <input
                type="text"
                className={s.lienTitre}
                maxLength={40}
                placeholder={libelle(lien.cle)}
                aria-label={`Titre affiché pour « ${libelle(lien.cle)} »`}
                value={lien.libelle ?? ""}
                onChange={(e) => maj({ liens: liens.map((l, i) => (i === rang ? { ...l, libelle: e.target.value } : l)) })}
              />
            </div>
          </LigneOrdonnee>
        ))}
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Nom TROOVANTE</legend>
        <ChoixPolice label="Police" valeur={valeur.nom.police} onChange={(police) => maj({ nom: { ...valeur.nom, police } })} />
        <div className={s.ligne2}>
          <Curseur label="Taille" valeur={valeur.nom.taille} min={12} max={48} unite=" px" onChange={(taille) => maj({ nom: { ...valeur.nom, taille } })} />
          <Choix<Graisse> label="Épaisseur" valeur={valeur.nom.graisse} options={GRAISSES} onChange={(graisse) => maj({ nom: { ...valeur.nom, graisse } })} />
        </div>
        <Curseur
          label="Espacement des lettres"
          valeur={valeur.nom.espacement}
          min={0}
          max={80}
          afficher={(v) => `${(v / 100).toFixed(2).replace(".", ",")} em`}
          onChange={(espacement) => maj({ nom: { ...valeur.nom, espacement } })}
        />
        <Curseur
          label="Décalage vers la droite"
          valeur={valeur.nom.decalage}
          min={0}
          max={160}
          pas={4}
          unite=" px"
          onChange={(decalage) => maj({ nom: { ...valeur.nom, decalage } })}
        />
      </fieldset>

      <fieldset className={s.groupe}>
        <legend>Liens de la barre</legend>
        <ChoixPolice label="Police" valeur={valeur.liensStyle.police} onChange={(police) => maj({ liensStyle: { ...valeur.liensStyle, police } })} />
        <div className={s.ligne2}>
          <Curseur label="Taille" valeur={valeur.liensStyle.taille} min={11} max={22} unite=" px" onChange={(taille) => maj({ liensStyle: { ...valeur.liensStyle, taille } })} />
          <Choix<Graisse>
            label="Épaisseur"
            valeur={valeur.liensStyle.graisse}
            options={GRAISSES}
            onChange={(graisse) => maj({ liensStyle: { ...valeur.liensStyle, graisse } })}
          />
        </div>
      </fieldset>
    </>
  );
}
