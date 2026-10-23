/**
 * Préparation des photos dans le navigateur, avant leur envoi.
 */

const COTE_MAX = 2560;

/**
 * Réduit une photo trop lourde avant l'envoi (les téléphones produisent des
 * fichiers de 5 à 10 Mo). En cas de souci, la photo d'origine est gardée.
 */
export async function alleger(fichier: File): Promise<File> {
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

/** Largeur et hauteur d'une image, en pixels (orientation de l'appareil photo prise en compte). */
export async function dimensions(fichier: File): Promise<{ largeur: number; hauteur: number }> {
  try {
    const image = await createImageBitmap(fichier, { imageOrientation: "from-image" });
    const taille = { largeur: image.width, hauteur: image.height };
    image.close();
    return taille;
  } catch {
    return { largeur: 1600, hauteur: 900 };
  }
}
