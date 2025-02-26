"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText} from "lucide-react";
import Link from "next/link";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantsByIdProductGroupApi} from "src/actions/unirefund/CrmService/actions";
import {getProductGroupsApi} from "src/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "@/utils";
import ProductGroups from "./table";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      await getMerchantsByIdProductGroupApi(partyId, session),
      await getProductGroupsApi(
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
export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(partyId);

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [productGroupsResponse, productGroupListResponse] = apiRequests.data;
  return (
    <FormReadyComponent
      active={!productGroupListResponse.data.items || productGroupListResponse.data.items.length < 1}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.ProductGroup.Title"],
        message: languageData["Missing.ProductGroup.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("settings/product/product-groups/new", lang)}>{languageData.New}</Link>
          </Button>
        ),
      }}>
      <ProductGroups
        languageData={languageData}
        productGroupList={productGroupListResponse.data.items || []}
        response={productGroupsResponse.data}
      />
    </FormReadyComponent>
  );
}
