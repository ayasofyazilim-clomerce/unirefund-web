"use client";

import type {UniRefund_CRMService_Customs_CustomListResponseDto} from "@repo/saas/CRMService";
import type {UniRefund_TagService_Tags_ExportValidationRequestDto} from "@repo/saas/TagService";
import {$UniRefund_TagService_Tags_ExportValidationRequestDto} from "@repo/saas/TagService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useParams, useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {putExportValidationByIdApi} from "@repo/actions/unirefund/TagService/put-actions";
import type {ExportValidationServiceResource} from "src/language-data/unirefund/ExportValidationService";

export default function Form({
  languageData,
  customList,
}: {
  languageData: ExportValidationServiceResource;
  customList: UniRefund_CRMService_Customs_CustomListResponseDto[];
}) {
  const {exportValidationId: tagId} = useParams<{
    exportValidationId: string;
  }>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultFormData: UniRefund_TagService_Tags_ExportValidationRequestDto = {
    exportDate: new Date().toISOString(),
    customsId: customList[0]?.id || "",
    referenceId: "",
    responseCode: "",
    description: "",
  } as UniRefund_TagService_Tags_ExportValidationRequestDto;

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TagService_Tags_ExportValidationRequestDto,
    resources: languageData,
    name: "Form.ExportValidation",
    extend: {
      customsId: {
        "ui:widget": "CustomWidget",
      },
      "ui:className": "grid grid-cols-1 lg:grid-cols-2 gap-4 py-4",
      description: {
        "ui:className": "col-span-full",
      },
    },
  });
  return (
    <SchemaForm<UniRefund_TagService_Tags_ExportValidationRequestDto>
      className="flex flex-col gap-4"
      disabled={loading}
      filter={{
        type: "include",
        sort: true,
        keys: ["customsId", "referenceId", "exportDate", "responseCode", "description"],
      }}
      formData={defaultFormData}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void putExportValidationByIdApi({
          id: tagId,
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router);
            if (res.type === "success") {
              router.push(`/operations/tax-free-tags/${tagId}`);
              router.refresh();
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_TagService_Tags_ExportValidationRequestDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      widgets={{
        CustomWidget: CustomComboboxWidget<UniRefund_CRMService_Customs_CustomListResponseDto>({
          languageData,
          list: customList,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}
