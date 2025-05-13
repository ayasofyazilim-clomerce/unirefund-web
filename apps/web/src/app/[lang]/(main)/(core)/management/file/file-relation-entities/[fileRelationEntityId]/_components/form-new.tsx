"use client";

import {
  $UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto,
  type UniRefund_FileService_FileRelationEntities_FileRelationEntityCreateDto,
  type UniRefund_FileService_FileTypes_FileTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import {postFileRelationEntitiesApi} from "@repo/actions/unirefund/FileService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  fileTypeData,
}: {
  languageData: IdentityServiceResource;
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[];
}) {
  const router = useRouter();
  return (
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
  );
}
