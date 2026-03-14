import enUs from "@/locales/en-us.json";
import esEs from "@/locales/es-es.json";

const locales = {
  "en-us": enUs,
  "es-es": esEs,
} as const;

export type Translations = typeof enUs;

export function getTranslations(lang: string): Translations {
  return locales[lang as keyof typeof locales] ?? locales["en-us"];
}
