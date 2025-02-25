"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatDetailsByIdApi} from "src/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/SettingService";
import Form from "./_components/form";

async function getApiRequests(vatId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getVatDetailsByIdApi(vatId, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({params}: {params: {lang: string; vatId: string}}) {
  const {lang, vatId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["SettingService.Vats.Edit"],
    lang,
  });

  const apiRequests = await getApiRequests(vatId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [vatDetailsResponse] = apiRequests.data;

  return (
    <>
      <Form languageData={languageData} response={vatDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Vat} (${vatDetailsResponse.data.percent})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Vats.Edit.Description"]}
      </div>
    </>
  );
}
