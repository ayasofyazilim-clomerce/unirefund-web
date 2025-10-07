import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest} from "@repo/utils/api";
import {getResourceData} from "@/language-data/unirefund/TagService";
import TaxFreeTagsTable from "./_components/table";

export default async function Page({params}: {params: {id: string; lang: string}}) {
  const {lang, id} = params;
  const {languageData} = await getResourceData(lang);

  const tagsResponse = await getTagsApi({refundId: id});
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tagsResponse.message} />;
  }
  return <TaxFreeTagsTable languageData={languageData} response={tagsResponse.data} />;
}
