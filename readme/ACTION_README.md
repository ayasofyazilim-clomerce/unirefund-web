# Action yapısı

```tsx
"use server";
import {isUnauthorized} from "@repo/utils/policies";

export async function getTagByIdApi(data: GetApiTagServiceTagByIdDetailData) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds.DetailByTagId", "RefundService.Refunds.Detail"],
    lang: "tr",
  });
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagByIdDetail(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
```
