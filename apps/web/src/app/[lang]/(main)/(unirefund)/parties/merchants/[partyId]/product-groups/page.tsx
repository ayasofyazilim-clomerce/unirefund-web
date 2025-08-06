"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText} from "lucide-react";
import Link from "next/link";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantProductGroupByMerchantIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getProductGroupsApi} from "@repo/actions/unirefund/SettingService/actions";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "@/utils";
import ProductGroups from "./table";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getMerchantProductGroupByMerchantIdApi(partyId, session),
      getProductGroupsApi({}),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
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
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [merchantProductGroupsResponse, productGroupListResponse] = apiRequests.requiredRequests;
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
        productGroupListByMerchant={merchantProductGroupsResponse.data}
      />
    </FormReadyComponent>
  );
}
