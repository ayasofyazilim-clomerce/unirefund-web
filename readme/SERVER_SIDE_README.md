# Server side sayfa yapısı bu şekilde olmalı.

```
"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getRebateTableHeadersApi } from "src/actions/unirefund/ContractService/action";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";

async function getApiRequests(partyId: string) {
  const session = await auth();
  const requiredRequests = await Promise.all([
    getRebateTableHeadersApi({}, session),
    getRebateTableHeadersApi({}, session),
    getRebateTableHeadersApi({}, session),
  ]);
  const failureIndex = requiredRequests.findIndex((i) => i.type !== "success");
  if (failureIndex !== -1) {
    return {message: requiredRequests[failureIndex].message || "Unknown error occurred"};
  }

  const optionalPromises = [getRebateTableHeadersApi({}, session)];
  const optionalRequests = await Promise.allSettled(optionalPromises);
  return {requiredRequests: requiredRequests, optionalRequests: optionalRequests};
}

export default async function Page({params}: {params: {lang: string; partyId: string; contractId: string}}) {
  const {lang} = params;

  const {languageData} = await getResourceData(lang);

  const apiRequests3 = await getApiRequests("43950d9e-4444-0537-9444-3a17de3a5fe6");
  const {requiredRequests, optionalRequests} = apiRequests3;

  if (!requiredRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests3.message} />;
  }
  const [required1Response, required2Response, required3Response] = requiredRequests;
  const [optional1Response] = optionalRequests;

  return <>test</>;
}
```
