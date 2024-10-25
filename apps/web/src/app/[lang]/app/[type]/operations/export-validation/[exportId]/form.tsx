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
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { putExportValidationApi } from "src/app/[lang]/app/actions/ExportValidationService/put-actions";
import type { ExportValidationServiceResource } from "src/language-data/ExportValidationService";

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
      toast.success(languageData["ExportValidation.Update.Succes"]);
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  }

  return (
    <AutoForm
      fieldConfig={{
        exportLocationId: {
          renderer: (props) => (
            <CustomCombobox<UniRefund_CRMService_Customss_CustomsProfileDto>
              childrenProps={props}
              emptyValue="select Customs"
              list={CustomsData}
              selectIdentifier="id"
              selectLabel="name"
            />
          ),
        },
        tagId: {
          renderer: (props) => (
            <CustomCombobox<UniRefund_TagService_Tags_TagListItemDto>
              childrenProps={props}
              emptyValue="select Tag"
              list={TagsData}
              selectIdentifier="id"
              selectLabel="tagNumber"
            />
          ),
        },
      }}
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
