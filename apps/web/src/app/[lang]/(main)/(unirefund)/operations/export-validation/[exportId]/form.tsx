"use client";

import { toast } from "@/components/ui/sonner";
import type { UniRefund_CRMService_Customss_CustomsProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  UniRefund_ExportValidationService_ExportValidations_ExportValidationDto,
  UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
} from "@ayasofyazilim/saas/ExportValidationService";
import { $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto } from "@ayasofyazilim/saas/ExportValidationService";
import type { UniRefund_TagService_Tags_TagListItemDto } from "@ayasofyazilim/saas/TagService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { putExportValidationApi } from "src/actions/unirefund/ExportValidationService/put-actions";
import type { ExportValidationServiceResource } from "src/language-data/unirefund/ExportValidationService";

const ExportValidationSchema = createZodObject(
  $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
);

export default function Form({
  exportId,
  languageData,
  ExportValidationData,
  TagsData,
  CustomsData,
}: {
  exportId: string;
  languageData: ExportValidationServiceResource;
  ExportValidationData: UniRefund_ExportValidationService_ExportValidations_ExportValidationDto;
  TagsData: UniRefund_TagService_Tags_TagListItemDto[];
  CustomsData: UniRefund_CRMService_Customss_CustomsProfileDto[];
}) {
  async function updateExportValidation(
    data: UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
  ) {
    const response = await putExportValidationApi({
      id: exportId,
      requestBody: data,
    });
    if (response.type === "success") {
      toast.success(languageData["ExportValidation.Update.Success"]);
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  }

  const translatedForm = createFieldConfigWithResource({
    schema:
      $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
    resources: languageData,
    extend: {
      exportLocationId: {
        renderer: (props) => (
          <CustomCombobox<UniRefund_CRMService_Customss_CustomsProfileDto>
            childrenProps={props}
            emptyValue={languageData["Custom.Select"]}
            list={CustomsData}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="name"
          />
        ),
      },
      referenceId: { containerClassName: "gap-2" },
      tagId: {
        renderer: (props) => (
          <CustomCombobox<UniRefund_TagService_Tags_TagListItemDto>
            childrenProps={props}
            emptyValue={languageData["Tag.Select"]}
            list={TagsData}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="tagNumber"
          />
        ),
      },
    },
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 pb-4 md:grid-cols-1 lg:grid-cols-2 "
      fieldConfig={translatedForm}
      formSchema={ExportValidationSchema}
      onSubmit={(formdata) => {
        void updateExportValidation(formdata);
      }}
      values={ExportValidationData}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}
