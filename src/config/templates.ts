import type { ResumeTemplate } from "@/types/template";

import { classicConfig } from "@/components/templates/classic/config";
import { modernConfig } from "@/components/templates/modern/config";
import { leftRightConfig } from "@/components/templates/left-right/config";
import { timelineConfig } from "@/components/templates/timeline/config";
import { minimalistConfig } from "@/components/templates/minimalist/config";
import { elegantConfig } from "@/components/templates/elegant/config";
import { creativeConfig } from "@/components/templates/creative/config";
import { editorialConfig } from "@/components/templates/editorial/config";

export const DEFAULT_TEMPLATES: ResumeTemplate[] = [
  classicConfig,
  modernConfig,
  leftRightConfig,
  timelineConfig,
  minimalistConfig,
  elegantConfig,
  creativeConfig,
  editorialConfig,
];
