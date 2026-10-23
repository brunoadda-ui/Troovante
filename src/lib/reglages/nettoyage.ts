import { REGLAGES_ORIGINE } from "./defauts";
import {
  FORMES_BOUTON,
  GRAISSES,
  HAUTEURS,
  POLICES,
  POSITIONS,
  SECTIONS,
  TRANSITIONS,
  type CleSection,
  type ClePolice,
  type Graisse,
  type PhotoAccueil,
  type ReglagesAccueil,
  type StyleTexte,
  type TexteRegle,
} from "./types";

/**
 * Remet en forme des réglages lus dans le fichier ou envoyés par le
 * formulaire : chaque valeur absente, inconnue ou hors limites est remplacée
 * par la valeur d'origine. Le site s'affiche donc toujours, même si le
 * fichier est abîmé ou incomplet.
 */

type Brut = Record<string, unknown>;
const objet = (v: unknown): Brut => (v && typeof v === "object" && !Array.isArray(v) ? (v as Brut) : {});

const texte = (v: unknown, defaut: string, max = 300) => (typeof v === "string" ? v.slice(0, max) : defaut);
const booleen = (v: unknown, defaut: boolean) => (typeof v === "boolean" ? v : defaut);
const nombre = (v: unknown, defaut: number, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : defaut;
const parmi = <T extends string | number>(v: unknown, valeurs: readonly T[], defaut: T): T =>
  valeurs.includes(v as T) ? (v as T) : defaut;
const couleur = (v: unknown, defaut: string) =>
  typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : defaut;

/** Seuls les liens internes au site sont acceptés : « /univers/mobilier », « #nouvelles-trouvailles ». */
const lien = (v: unknown, defaut: string) =>
  typeof v === "string" && /^(\/[\w\-/.?=&%]*|#[\w-]+)$/.test(v) ? v.slice(0, 200) : defaut;

/** Seules les images du dossier du site sont acceptées. */
const image = (v: unknown): string | undefined =>
  typeof v === "string" && /^\/images\/[\w\-./]+\.(webp|jpe?g|png)$/i.test(v) && !v.includes("..") ? v : undefined;

const CLES_POLICES = POLICES.map((p) => p.cle) as ClePolice[];
const VALEURS_GRAISSES = GRAISSES.map((g) => g.valeur) as Graisse[];
const police = (v: unknown, defaut: ClePolice) => parmi(v, CLES_POLICES, defaut);
const graisse = (v: unknown, defaut: Graisse) => parmi(v, VALEURS_GRAISSES, defaut);

function style(v: unknown, d: StyleTexte): StyleTexte {
  const b = objet(v);
  return {
    police: police(b.police, d.police),
    taille: nombre(b.taille, d.taille, 8, 140),
    graisse: graisse(b.graisse, d.graisse),
    italique: booleen(b.italique, d.italique),
    souligne: booleen(b.souligne, d.souligne),
    capitales: booleen(b.capitales, d.capitales),
    espacement: nombre(b.espacement, d.espacement, -10, 60),
    couleur: couleur(b.couleur, d.couleur),
  };
}

function texteRegle(v: unknown, d: TexteRegle, max: number): TexteRegle {
  const b = objet(v);
  return { afficher: booleen(b.afficher, d.afficher), texte: texte(b.texte, d.texte, max), style: style(b.style, d.style) };
}

function photo(v: unknown): PhotoAccueil | undefined {
  const b = objet(v);
  const src = image(b.src);
  if (!src) return undefined;
  return {
    src,
    alt: texte(b.alt, "", 200),
    largeur: nombre(b.largeur, 1600, 1, 20000),
    hauteur: nombre(b.hauteur, 900, 1, 20000),
    cadrageX: nombre(b.cadrageX, 50, 0, 100),
    cadrageY: nombre(b.cadrageY, 50, 0, 100),
  };
}

const CLES_SECTIONS = SECTIONS.map((s) => s.cle) as CleSection[];

export function nettoyerReglages(brut: unknown): ReglagesAccueil {
  const o = REGLAGES_ORIGINE;
  const b = objet(brut);

  // --- Photo d'ouverture ---
  const visuel = objet(b.visuel);
  const diaporama = objet(visuel.diaporama);
  const photos = (Array.isArray(visuel.photos) ? visuel.photos : [])
    .map(photo)
    .filter((p): p is PhotoAccueil => Boolean(p))
    .slice(0, 8);

  // --- Texte sur la photo ---
  const textes = objet(b.textes);
  const bouton = objet(textes.bouton);

  // --- Apparence ---
  const apparence = objet(b.apparence);

  // --- Sections ---
  const sections = objet(b.sections);
  const ordreLu = (Array.isArray(sections.ordre) ? sections.ordre : []).filter((c): c is CleSection =>
    CLES_SECTIONS.includes(c as CleSection),
  );
  const ordre = [...new Set([...ordreLu, ...CLES_SECTIONS])];
  const masquees = (Array.isArray(sections.masquees) ? sections.masquees : []).filter((c): c is CleSection =>
    CLES_SECTIONS.includes(c as CleSection),
  );
  const engagementsLus = Array.isArray(sections.engagements) ? sections.engagements : [];
  const nouveautes = objet(sections.nouveautes);
  const styles = objet(sections.styles);
  const elementsLus = Array.isArray(styles.elements) ? styles.elements : [];
  const marchands = objet(sections.marchands);

  // --- Barre de navigation ---
  const barre = objet(b.barre);
  const liensLus = (Array.isArray(barre.liens) ? barre.liens : [])
    .map(objet)
    .filter((l) => typeof l.cle === "string" && /^[a-z0-9-]{1,80}$/.test(l.cle))
    .map((l) => {
      const libelle = texte(l.libelle, "", 40).trim();
      return { cle: l.cle as string, afficher: booleen(l.afficher, true), ...(libelle ? { libelle } : {}) };
    });
  const liensUniques = liensLus.filter((l, i) => liensLus.findIndex((m) => m.cle === l.cle) === i);
  const nom = objet(barre.nom);
  const liensStyle = objet(barre.liensStyle);

  return {
    visuel: {
      photos: photos.length > 0 ? photos : o.visuel.photos,
      diaporama: {
        actif: booleen(diaporama.actif, o.visuel.diaporama.actif),
        duree: nombre(diaporama.duree, o.visuel.diaporama.duree, 3, 15),
        transition: parmi(
          diaporama.transition,
          TRANSITIONS.map((t) => t.valeur),
          o.visuel.diaporama.transition,
        ),
        points: booleen(diaporama.points, o.visuel.diaporama.points),
        fleches: booleen(diaporama.fleches, o.visuel.diaporama.fleches),
        pauseSurvol: booleen(diaporama.pauseSurvol, o.visuel.diaporama.pauseSurvol),
      },
      hauteur: parmi(
        visuel.hauteur,
        HAUTEURS.map((h) => h.valeur),
        o.visuel.hauteur,
      ),
      voile: nombre(visuel.voile, o.visuel.voile, 0, 90),
      position: parmi(
        visuel.position,
        POSITIONS.map((p) => p.valeur),
        o.visuel.position,
      ),
    },
    textes: {
      surtitre: texteRegle(textes.surtitre, o.textes.surtitre, 120),
      titre: {
        ...texteRegle(textes.titre, o.textes.titre, 200),
        interligne: nombre(objet(textes.titre).interligne, o.textes.titre.interligne, 70, 200),
        largeur: nombre(objet(textes.titre).largeur, o.textes.titre.largeur, 10, 80),
        ombre: nombre(objet(textes.titre).ombre, o.textes.titre.ombre, 0, 100),
      },
      bouton: {
        ...texteRegle(bouton, o.textes.bouton, 60),
        lien: lien(bouton.lien, o.textes.bouton.lien),
        forme: parmi(
          bouton.forme,
          FORMES_BOUTON.map((f) => f.valeur),
          o.textes.bouton.forme,
        ),
      },
    },
    apparence: {
      policeTitres: police(apparence.policeTitres, o.apparence.policeTitres),
      tailleTitres: nombre(apparence.tailleTitres, o.apparence.tailleTitres, 16, 64),
      policeTexte: police(apparence.policeTexte, o.apparence.policeTexte),
      tailleTexte: nombre(apparence.tailleTexte, o.apparence.tailleTexte, 12, 22),
      couleurAccent: couleur(apparence.couleurAccent, o.apparence.couleurAccent),
      couleurTexte: couleur(apparence.couleurTexte, o.apparence.couleurTexte),
      couleurFond: couleur(apparence.couleurFond, o.apparence.couleurFond),
    },
    sections: {
      ordre,
      masquees: [...new Set(masquees)],
      engagements: o.sections.engagements.map((d, i) => {
        const e = objet(engagementsLus[i]);
        return { titre: texte(e.titre, d.titre, 80), texte: texte(e.texte, d.texte, 200) };
      }),
      univers: { titre: texte(objet(sections.univers).titre, o.sections.univers.titre, 120) },
      nouveautes: {
        titre: texte(nouveautes.titre, o.sections.nouveautes.titre, 120),
        nombre: nombre(nouveautes.nombre, o.sections.nouveautes.nombre, 2, 24),
        mentionSemaine: booleen(nouveautes.mentionSemaine, o.sections.nouveautes.mentionSemaine),
      },
      styles: {
        titre: texte(styles.titre, o.sections.styles.titre, 120),
        elements: o.sections.styles.elements.map((d, i) => {
          const e = objet(elementsLus[i]);
          return {
            titre: texte(e.titre, d.titre, 80),
            texte: texte(e.texte, d.texte, 200),
            lien: lien(e.lien, d.lien),
            photo: image(e.photo),
          };
        }),
      },
      marchands: {
        surtitre: texte(marchands.surtitre, o.sections.marchands.surtitre, 80),
        titre: texte(marchands.titre, o.sections.marchands.titre, 160),
        texte: texte(marchands.texte, o.sections.marchands.texte, 600),
        chiffres: booleen(marchands.chiffres, o.sections.marchands.chiffres),
        photo: image(marchands.photo),
      },
    },
    barre: {
      transparente: booleen(barre.transparente, o.barre.transparente),
      liens: liensUniques.length > 0 ? liensUniques : o.barre.liens,
      nom: {
        police: police(nom.police, o.barre.nom.police),
        taille: nombre(nom.taille, o.barre.nom.taille, 12, 48),
        graisse: graisse(nom.graisse, o.barre.nom.graisse),
        espacement: nombre(nom.espacement, o.barre.nom.espacement, 0, 80),
        decalage: nombre(nom.decalage, o.barre.nom.decalage, 0, 160),
      },
      liensStyle: {
        police: police(liensStyle.police, o.barre.liensStyle.police),
        taille: nombre(liensStyle.taille, o.barre.liensStyle.taille, 11, 22),
        graisse: graisse(liensStyle.graisse, o.barre.liensStyle.graisse),
      },
    },
  };
}
