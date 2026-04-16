import test from "node:test";
import assert from "node:assert/strict";

import {
  createDefaultCustomItem,
  getDefaultCustomSectionTitle,
} from "../src/features/custom-section/defaults";
import {
  mapAppLocaleToDateLocale,
  resolveAppLocale,
} from "../src/i18n/app-locale";
import { getPreferredLocale } from "../src/i18n/runtime";
import {
  createTemplatePreviewData,
  getTemplateById,
  resolveTemplatePreviewLocale,
} from "../src/lib/templatePreview";

test("resolveAppLocale normalizes supported and unsupported locales", () => {
  assert.equal(resolveAppLocale("en"), "en");
  assert.equal(resolveAppLocale("zh"), "zh");
  assert.equal(resolveAppLocale("fr"), "en");
  assert.equal(resolveAppLocale(undefined), "en");
});

test("mapAppLocaleToDateLocale maps app locales to BCP47 locales", () => {
  assert.equal(mapAppLocaleToDateLocale("en"), "en-US");
  assert.equal(mapAppLocaleToDateLocale("zh"), "zh-CN");
  assert.equal(mapAppLocaleToDateLocale("fr"), "en-US");
});

test("getPreferredLocale falls back to English on the root path", () => {
  assert.equal(getPreferredLocale("/"), "en");
});

test("createDefaultCustomItem uses English defaults for the English locale", () => {
  assert.deepEqual(createDefaultCustomItem("en", "custom-item-id"), {
    id: "custom-item-id",
    title: "Untitled Section",
    subtitle: "",
    dateRange: "",
    description: "",
    visible: true,
  });
});

test("getDefaultCustomSectionTitle includes the section number", () => {
  assert.equal(getDefaultCustomSectionTitle("custom-3", "en"), "Custom Section 3");
  assert.equal(getDefaultCustomSectionTitle("custom-12", "zh"), "自定义模块 12");
});

test("resolveTemplatePreviewLocale prefers the first supported locale candidate", () => {
  assert.equal(resolveTemplatePreviewLocale(undefined, "en", "zh"), "en");
  assert.equal(resolveTemplatePreviewLocale("zh", "en"), "zh");
  assert.equal(resolveTemplatePreviewLocale(undefined, "fr"), "zh");
});

test("createTemplatePreviewData uses English seed data for English previews", () => {
  const previewData = createTemplatePreviewData(getTemplateById("classic"), "en", {
    id: "preview-en-classic",
    themeColor: "#123456",
  });

  assert.equal(previewData.id, "preview-en-classic");
  assert.equal(previewData.globalSettings.themeColor, "#123456");
  assert.equal(previewData.basic.name, "Dva");
  assert.equal(previewData.basic.location, "San Francisco, CA");
  assert.equal(previewData.education[0]?.school, "Stanford University");
  assert.equal(previewData.projects[0]?.name, "TikTok Creator Platform");
});
