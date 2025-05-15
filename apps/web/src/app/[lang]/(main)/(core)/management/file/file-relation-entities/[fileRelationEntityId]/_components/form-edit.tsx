"use client";

import {
  $UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto,
  type UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto,
  type UniRefund_FileService_FileTypes_FileTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import {putFileRelationEntitiesApi} from "@repo/actions/unirefund/FileService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

export default function Form({
  languageData,
  fileTypeData,
  fileRelationEntityData,
}: {
  languageData: FileServiceResource;
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[];
  fileRelationEntityData: UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto;
}) {
  const router = useRouter();
  return (
    <SchemaForm<UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto>
      className="flex flex-col gap-4"
      filter={{
        keys: ["id"],
        type: "exclude",
      }}
      formData={fileRelationEntityData}
      onSubmit={({formData}) => {
        if (!formData) return;
        void putFileRelationEntitiesApi({
          id: fileRelationEntityData.id,
          requestBody: formData,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={$UniRefund_FileService_FileRelationEntities_FileRelationEntityListDto}
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
