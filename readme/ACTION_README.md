# Action yapısı

```tsx
"use server";
import {isUnauthorized} from "@repo/utils/policies";

export async function getRebateTableHeadersApi(
  data: GetApiContractServiceRebateTableHeadersData,
  session?: Session | null,
) {
  await isUnauthorized({
    requiredPolicies: ["ContractService.RebateSetting.Edit"],
    lang: "tr",
  });
  try {
    const client = await getContractServiceClient(session);
    return structuredSuccessResponse(await client.rebateTableHeader.getApiContractServiceRebateTableHeaders(data));
  } catch (error) {
    return structuredError(error);
  }
}
```
