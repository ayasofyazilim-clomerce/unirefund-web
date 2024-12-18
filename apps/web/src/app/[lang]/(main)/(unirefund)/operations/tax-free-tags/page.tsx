"use server";

import type { GetApiTagServiceTagData } from "@ayasofyazilim/saas/TagService";
import { getTagsApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import RefundsTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams?: GetApiTagServiceTagData;
}) {
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang: props.params.lang,
  });

  const searchParams = props.searchParams;

  const response = await getTagsApi(searchParams);
  if (isErrorOnRequest(response, props.params.lang)) return;

  const { languageData } = await getResourceData(props.params.lang);

  return (
    <RefundsTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}
