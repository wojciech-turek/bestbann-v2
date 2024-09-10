import { Dictionary } from "@/types/dictionary";
import "server-only";

// Define the type based on the en.json structure

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  nl: () => import("./dictionaries/nl.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => dictionaries[locale]();
