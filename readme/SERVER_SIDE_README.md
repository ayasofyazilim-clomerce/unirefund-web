# Server side sayfa yapısı bu şekilde olmalı.

```
"use server";

import {getRebateTableHeadersApi} from "@/actions/unirefund/ContractService/action";
import {getMerchantsApi} from "@/actions/unirefund/CrmService/actions";
import {structuredError} from "@/lib";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRebateTableHeadersApi({}, session),
      getMerchantsApi({}, session),
      getRebateTableHeadersApi({}, session),
    ]);
    const failureIndex = requiredRequests.findIndex((i) => i.type !== "success");
    if (failureIndex !== -1) {
      return {message: requiredRequests[failureIndex].message || "Unknown error occurred"};
    }

    const optionalRequests = await Promise.allSettled([
      getRebateTableHeadersApi({}, session),
      getMerchantsApi({}, session),
    ]);
    return {requiredRequests: requiredRequests, optionalRequests: optionalRequests};
  } catch (error) {
    return structuredError(error);
  }
}

export default async function Page({params}: {params: {lang: string; partyId: string; contractId: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests, optionalRequests} = apiRequests;
  const [requiredResponse1, requiredResponse2] = requiredRequests;
  const [optionalResponse1, optionalResponse2] = optionalRequests;

  return <>test</>;
}
```
