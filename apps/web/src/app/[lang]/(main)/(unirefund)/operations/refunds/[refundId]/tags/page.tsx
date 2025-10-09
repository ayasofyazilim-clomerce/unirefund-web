import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest} from "@repo/utils/api";
import {isUnauthorized} from "@repo/utils/policies";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {Lock} from "lucide-react";
import {getResourceData} from "@/language-data/unirefund/TagService";
import TaxFreeTagsTable from "./_components/table";

export default async function Page({params}: {params: {refundId: string; lang: string}}) {
  const {lang, refundId} = params;
  const {languageData} = await getResourceData(lang);
  const tagViewIsNotGranted = await isUnauthorized({
    requiredPolicies: ["TagService.Tags", "TagService.Tags.View"],
    lang,
    redirect: false,
  });
  if (tagViewIsNotGranted)
    return (
      <FormReadyComponent
        active
        content={{
          icon: <Lock className="size-20 text-gray-400" />,
          title: languageData["Missing.Permission.Title"],
          message: languageData["Missing.Permission.Description"],
        }}>
        <div />
      </FormReadyComponent>
    );

  const tagsResponse = await getTagsApi({refundId});
  if (isErrorOnRequest(tagsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={tagsResponse.message} />;
  }
  return <TaxFreeTagsTable languageData={languageData} response={tagsResponse.data} />;
}
