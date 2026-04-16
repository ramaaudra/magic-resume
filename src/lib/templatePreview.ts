import { DEFAULT_TEMPLATES } from "@/config";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import type { ResumeData } from "@/types/resume";
import type { ResumeTemplate } from "@/types/template";

export const TEMPLATE_PREVIEW_WIDTH_PX = 794;
export const TEMPLATE_PREVIEW_HEIGHT_PX = 1123;
export const TEMPLATE_SNAPSHOT_VERSION = 1;
export const TEMPLATE_SNAPSHOT_ROOT_ATTRIBUTE = "data-template-snapshot-root";
export const TEMPLATE_SNAPSHOT_ROOT_SELECTOR = `[${TEMPLATE_SNAPSHOT_ROOT_ATTRIBUTE}]`;
export const TEMPLATE_SNAPSHOT_PUBLIC_DIR = "template-snapshots";
export const TEMPLATE_PREVIEW_LOCALES = ["zh", "en"] as const;

export type TemplatePreviewLocale = (typeof TEMPLATE_PREVIEW_LOCALES)[number];

interface CreateTemplatePreviewDataOptions {
  id?: string;
  themeColor?: string;
  overrides?: Partial<ResumeData>;
}

export interface TemplateSnapshotManifest {
  version: number;
  generatedAt: string | null;
  locales: Record<TemplatePreviewLocale, Record<string, string>>;
}

export const createEmptyTemplateSnapshotManifest =
  (): TemplateSnapshotManifest => ({
    version: TEMPLATE_SNAPSHOT_VERSION,
    generatedAt: null,
    locales: {
      zh: {},
      en: {},
    },
  });

export const isTemplatePreviewLocale = (
  value: string | null | undefined
): value is TemplatePreviewLocale =>
  value === "zh" || value === "en";

export const resolveTemplatePreviewLocale = (
  ...candidates: Array<string | null | undefined>
): TemplatePreviewLocale =>
  candidates.find((candidate) => isTemplatePreviewLocale(candidate)) ?? "zh";

export const getTemplateById = (templateId: string | undefined): ResumeTemplate =>
  DEFAULT_TEMPLATES.find((template) => template.id === templateId) ??
  DEFAULT_TEMPLATES[0];

export const getTemplatePreviewBaseData = (locale: TemplatePreviewLocale) =>
  locale === "en" ? initialResumeStateEn : initialResumeState;

export const createTemplatePreviewData = (
  template: ResumeTemplate,
  locale: TemplatePreviewLocale,
  options: CreateTemplatePreviewDataOptions = {}
): ResumeData => {
  const baseData = getTemplatePreviewBaseData(locale);
  const {
    basic: basicOverrides,
    globalSettings: globalSettingsOverrides,
    ...rootOverrides
  } = options.overrides ?? {};

  return {
    ...baseData,
    ...rootOverrides,
    id: options.id ?? `preview-mock-${locale}-${template.id}`,
    templateId: template.id,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    globalSettings: {
      ...baseData.globalSettings,
      ...globalSettingsOverrides,
      themeColor: options.themeColor ?? template.colorScheme.primary,
      sectionSpacing: template.spacing.sectionGap,
      paragraphSpacing: template.spacing.itemGap,
      pagePadding: template.spacing.contentPadding,
    },
    basic: {
      ...baseData.basic,
      ...basicOverrides,
      layout: template.basic.layout,
    },
  } as ResumeData;
};

export const getTemplateSnapshotPath = (
  locale: TemplatePreviewLocale,
  templateId: string
) => `/${TEMPLATE_SNAPSHOT_PUBLIC_DIR}/${locale}/${templateId}.png`;

export const getTemplateSnapshotSrc = (
  manifest: TemplateSnapshotManifest,
  locale: TemplatePreviewLocale,
  templateId: string
) => manifest.locales[locale][templateId] ?? null;
