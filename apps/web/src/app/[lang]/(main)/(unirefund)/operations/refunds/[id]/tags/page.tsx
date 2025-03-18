import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getResourceData} from "@/language-data/unirefund/TagService";
import type {TagsSearchParamType} from "../../../tax-free-tags/_components/utils";
import {initParams} from "../../../tax-free-tags/_components/utils";
import TaxFreeTagsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: TagsSearchParamType;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const tagData = initParams(searchParams);

  const tagsResponse = await getTagsApi(tagData);
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tagsResponse.message} />;
  }
  return <TaxFreeTagsTable languageData={languageData} response={tagsResponse.data} />;
}
