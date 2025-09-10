"use client";

import {
  $UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto,
  type UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto,
  type UniRefund_FileService_FileTypes_FileTypeListDto,
} from "@repo/saas/FileService";
import {postFileRelationEntitiesApi} from "@repo/actions/unirefund/FileService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";
import {checkIsFormReady} from "../../../_components/utils";

export default function Form({
  languageData,
  fileTypeData,
}: {
  languageData: FileServiceResource;
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[];
}) {
  const router = useRouter();
  const {lang} = useParams<{lang: string}>();
  const isFormReady = checkIsFormReady({
    lang,
    languageData,
    fileTypeDataLength: fileTypeData.length,
  });
  return (
    <FormReadyComponent active={isFormReady.isActive} content={isFormReady.content}>
      <SchemaForm<UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto>
        className="flex flex-col gap-4"
        onSubmit={({formData}) => {
          if (!formData) return;
          void postFileRelationEntitiesApi({
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        }}
        schema={$UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto}
        submitText={languageData.Save}
        uiSchema={{
          fileTypeId: {
            "ui:widget": "File",
          },
        }}
        widgets={{
          File: CustomComboboxWidget<UniRefund_FileService_FileTypes_FileTypeListDto>({
            languageData,
            list: fileTypeData,
            selectIdentifier: "id",
            selectLabel: "name",
          }),
        }}
      />
    </FormReadyComponent>
  );
}
