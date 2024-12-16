"use server";

import { getCustomsApi } from "src/actions/unirefund/CrmService/actions";
import { getTagsApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/ExportValidationService";
import Form from "./form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { languageData } = await getResourceData(params.lang);
  const Customs = await getCustomsApi();
  const CustomsList = (Customs.type === "success" && Customs.data.items) || [];
  const Tag = await getTagsApi();
  const TagsList = (Tag.type === "success" && Tag.data.items) || [];
  return (
    <Form
      CustomsData={CustomsList}
      TagsData={TagsList}
      languageData={languageData}
    />
  );
}
