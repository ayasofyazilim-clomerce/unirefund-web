"use client";

import { $UniRefund_FileService_FileTypes_FileTypeCreateDto } from "@repo/saas/FileService";
import type {
  UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto,
  UniRefund_FileService_FileTypes_FileTypeCreateDto,
  UniRefund_FileService_Providers_ProviderListDto,
} from "@repo/saas/FileService";
import { postFileTypesApi } from "@repo/actions/unirefund/FileService/post-actions";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { handlePutResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import type { FileServiceResource } from "@/language-data/unirefund/FileService";
import { checkIsFormReady } from "../../../_components/utils";

export default function NewForm({
  languageData,
  fileTypeGroupData,
  providerData,
}: {
  languageData: FileServiceResource;
  fileTypeGroupData: UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto[];

  providerData: UniRefund_FileService_Providers_ProviderListDto[];
}) {
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const isFormReady = checkIsFormReady({
    lang,
    languageData,
    fileTypeGroupDataLength: fileTypeGroupData.length,
    providerDataLength: providerData.length,
  });
  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<UniRefund_FileService_FileTypes_FileTypeCreateDto>
        className="flex flex-col gap-4"
        onSubmit={({ formData }) => {
          if (!formData) return;
          void postFileTypesApi({
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        }}
        schema={$UniRefund_FileService_FileTypes_FileTypeCreateDto}
        submitText={languageData.Save}
        uiSchema={{
          fileTypeGroupNamespace: {
            "ui:widget": "File",
          },
          providerID: {
            "ui:widget": "Provider",
          },
        }}
        widgets={{
          File: CustomComboboxWidget<UniRefund_FileService_FileTypeGroups_FileTypeGroupListDto>({
            languageData,
            list: fileTypeGroupData,
            selectIdentifier: "namespace",
            selectLabel: "name",
          }),
          Provider: CustomComboboxWidget<UniRefund_FileService_Providers_ProviderListDto>({
            languageData,
            list: providerData,
            selectIdentifier: "id",
            selectLabel: "type",
          }),
        }}
      />
    </FormReadyComponent>
  );
}
