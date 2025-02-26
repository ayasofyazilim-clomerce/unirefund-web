"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getproductGroupDetailsByIdApi, getVatsApi} from "src/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/SettingService";
import Form from "./_components/form";

async function getApiRequests(productGroupId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getproductGroupDetailsByIdApi(productGroupId, session),
      getVatsApi(
        {
          maxResultCount: 1000,
        },
        session,
      ),
    ]);
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

export default async function Page({params}: {params: {lang: string; productGroupId: string}}) {
  const {lang, productGroupId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups.Edit"],
    lang,
  });

  const apiRequests = await getApiRequests(productGroupId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [productGroupDetailsResponse, vatsResponse] = apiRequests.data;

  return (
    <>
      <Form
        languageData={languageData}
        response={productGroupDetailsResponse.data}
        vatList={vatsResponse.data.items || []}
      />
      <div className="hidden" id="page-title">
        {`${languageData.ProductGroup} (${productGroupDetailsResponse.data.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["ProductGroups.Edit.Description"]}
      </div>
    </>
  );
}
