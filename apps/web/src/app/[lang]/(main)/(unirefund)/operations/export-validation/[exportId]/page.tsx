"use server";

import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import { getExportValidationDetailApi } from "src/actions/unirefund/ExportValidationService/actions";
import { getTagsApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { exportId: string; lang: string };
}) {
  const { languageData } = await getResourceData(params.lang);
  const ExportValidation = await getExportValidationDetailApi(params.exportId);
  const Customs = await getCustomsApi();
  const Tags = await getTagsApi();

  const ExportValidationList =
    ExportValidation.type === "success" && ExportValidation.data;
  const CustomsList = (Customs.type === "success" && Customs.data.items) || [];
  const TagsList = (Tags.type === "success" && Tags.data.items) || [];

  return (
    <Form
      CustomsData={CustomsList}
      ExportValidationData={ExportValidationList || {}}
      TagsData={TagsList}
      exportId={params.exportId}
      languageData={languageData}
    />
  );
}
