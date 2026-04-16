import { Suspense, lazy } from "react";
import { ResumeTemplate } from "@/types/template";
import { normalizeFontFamily } from "@/utils/fonts";
import {
  createTemplatePreviewData,
  type TemplatePreviewLocale,
} from "@/lib/templatePreview";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ResumeTemplateComponent = lazy(() => import("@/components/templates"));

interface TemplatePreviewDialogProps {
  open: boolean;
  template: ResumeTemplate | null;
  previewLocale: TemplatePreviewLocale;
  selectedColor: string;
  snapshotSrc: string | null;
  title: string;
  description: string;
  useTemplateLabel: string;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (templateId: string) => void;
}

const TemplatePreviewDialog = ({
  open,
  template,
  previewLocale,
  selectedColor,
  snapshotSrc,
  title,
  description,
  useTemplateLabel,
  onOpenChange,
  onUseTemplate,
}: TemplatePreviewDialogProps) => {
  if (!template) {
    return null;
  }

  const previewData = createTemplatePreviewData(template, previewLocale, {
    id: `template-preview-modal-${template.id}`,
    themeColor: selectedColor || undefined,
  });

  const selectedFontFamily = normalizeFontFamily(
    previewData.globalSettings?.fontFamily
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-[680px] p-0 overflow-hidden border-0 shadow-lg rounded-xl bg-white dark:bg-gray-900">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col">
          <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>

          <div className="overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-8 pointer-events-none">
            <div
              className="relative bg-white shadow-md ring-1 ring-gray-200/50 overflow-hidden"
              style={{ width: "420px", height: "594px" }}
            >
              <div
                className="absolute top-0 left-0 bg-white"
                style={{
                  width: "210mm",
                  height: "297mm",
                  transform: "scale(0.529166667)",
                  transformOrigin: "top left",
                  padding: `${template.spacing.contentPadding}px`,
                  fontFamily: selectedFontFamily,
                }}
              >
                <Suspense
                  fallback={
                    snapshotSrc ? (
                      <img
                        src={snapshotSrc}
                        alt={title}
                        className="h-full w-full object-cover object-top"
                        draggable={false}
                      />
                    ) : null
                  }
                >
                  <ResumeTemplateComponent data={previewData} template={template} />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="p-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <Button
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                onUseTemplate(template.id);
              }}
            >
              {useTemplateLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewDialog;
