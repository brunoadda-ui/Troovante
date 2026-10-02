"use server";

import { getObjetParSlug } from "@/lib/catalogue";
import { supabase, supabaseConfigure } from "@/lib/supabase";

/** Ce que le visiteur a saisi, pour le réafficher si la demande est refusée. */
export type SaisieDemande = { prenom: string; email: string; telephone: string; message: string };

export type EtatDemande =
  | { statut: "initial" }
  | { statut: "envoyee"; prenom: string }
  | { statut: "erreur"; message: string; saisie: SaisieDemande };

const TYPES = ["achat", "question", "rappel"] as const;
type TypeDemande = (typeof TYPES)[number];

const champ = (formulaire: FormData, nom: string, longueurMax: number) =>
  String(formulaire.get(nom) ?? "")
    .trim()
    .slice(0, longueurMax);

/**
 * Enregistre une demande de visiteur (achat, question sur un objet, rappel)
 * dans la table « demandes » de la base.
 */
export async function envoyerDemande(_precedent: EtatDemande, formulaire: FormData): Promise<EtatDemande> {
  const prenom = champ(formulaire, "prenom", 80);
  const email = champ(formulaire, "email", 160);
  const telephone = champ(formulaire, "telephone", 30);
  const message = champ(formulaire, "message", 2000);

  const erreur = (texte: string): EtatDemande => ({
    statut: "erreur",
    message: texte,
    saisie: { prenom, email, telephone, message },
  });

  const type = champ(formulaire, "type", 20) as TypeDemande;
  if (!TYPES.includes(type)) return erreur("Demande non reconnue.");

  // Champ invisible pour un humain : s'il est rempli, c'est un robot. On fait comme si de rien n'était.
  if (champ(formulaire, "site_web", 200)) return { statut: "envoyee", prenom };

  if (!prenom) return erreur("Indiquez votre prénom.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erreur("Cette adresse e-mail ne semble pas valide.");
  if (telephone) {
    const chiffres = telephone.replace(/\D/g, "").length;
    if (chiffres < 9 || chiffres > 15) return erreur("Ce numéro de téléphone ne semble pas valide.");
  }
  if (type === "rappel" && !telephone) return erreur("Indiquez le numéro auquel vous rappeler.");
  if (type !== "rappel" && !email && !telephone) return erreur("Indiquez un e-mail ou un téléphone pour vous répondre.");
  if (type === "question" && !message) return erreur("Écrivez votre question.");

  const slug = champ(formulaire, "objet", 200);
  const objet = slug ? await getObjetParSlug(slug) : undefined;
  if (type !== "rappel" && !objet) return erreur("Cet objet n’est plus au catalogue.");

  if (!supabaseConfigure) {
    return erreur("La base de données n’est pas encore branchée : votre demande n’a pas été enregistrée.");
  }

  const { error } = await supabase()
    .from("demandes")
    .insert({
      type,
      objet_id: objet?.id ?? null,
      objet_nom: objet?.nom ?? null,
      prenom,
      email: email || null,
      telephone: telephone || null,
      message: message || null,
    });

  if (error) {
    console.error("Enregistrement d'une demande impossible :", error.message);
    return erreur("Votre demande n’a pas pu être envoyée. Réessayez, ou appelez-nous.");
  }

  return { statut: "envoyee", prenom };
}
