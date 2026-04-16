import { createTranslator, type Translator } from "@/i18n/compat/utils";
import { defaultLocale, type Locale } from "@/i18n/config";
import enMessages from "@/i18n/locales/en.json";
import zhMessages from "@/i18n/locales/zh.json";
import { getPreferredLocale, isSupportedLocale } from "@/i18n/runtime";

const appMessages = {
  en: enMessages,
  zh: zhMessages,
} satisfies Record<Locale, Record<string, unknown>>;

export function resolveAppLocale(value?: string | null): Locale {
  if (value && isSupportedLocale(value)) {
    return value;
  }

  return defaultLocale;
}

export function getCurrentAppLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  return getPreferredLocale(window.location.pathname);
}

export function getAppMessages(locale?: string | null) {
  return appMessages[resolveAppLocale(locale)];
}

export function getAppTranslator(
  namespace?: string,
  locale?: string | null
): Translator {
  return createTranslator(getAppMessages(locale ?? getCurrentAppLocale()), namespace);
}

export function mapAppLocaleToDateLocale(locale?: string | null): string {
  return resolveAppLocale(locale) === "en" ? "en-US" : "zh-CN";
}
