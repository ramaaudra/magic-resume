import { generateUUID } from "@/utils/uuid";
import type { CustomItem } from "@/types/resume";
import { getAppTranslator } from "@/i18n/app-locale";

export function createDefaultCustomItem(
  locale?: string | null,
  id: string = generateUUID()
): CustomItem {
  const t = getAppTranslator("workbench.customSection", locale);

  return {
    id,
    title: t("defaults.itemTitle"),
    subtitle: "",
    dateRange: "",
    description: "",
    visible: true,
  };
}

export function getDefaultCustomSectionTitle(
  sectionId: string,
  locale?: string | null
): string {
  const t = getAppTranslator("workbench.customSection", locale);
  const sectionNumber = sectionId.match(/(\d+)$/)?.[1] ?? sectionId;

  return t("defaults.sectionTitle", { number: sectionNumber });
}
