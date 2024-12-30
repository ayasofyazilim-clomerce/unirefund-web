"use server";

import { getMerchantsApi, getRefundPointsApi } from "./actions";

export async function searchMerchants(search: string) {
  "use server";

  const res = await getMerchantsApi({ name: search });
  const data =
    res.type === "success"
      ? res.data.items?.map((i) => ({ id: i.id, name: i.name })) || []
      : [];
  return data;
}
export async function searchRefundPoints(search: string) {
  "use server";

  const res = await getRefundPointsApi({ name: search });
  const data =
    res.type === "success"
      ? res.data.items?.map((i) => ({
          id: i.id || "",
          name: i.name || "",
        })) || []
      : [];
  return data;
}
