"use server";

import { getMerchantsApi, getRefundPointsApi } from "./actions";

export async function searchMerchants(search: string) {
  try {
    const res = await getMerchantsApi({ name: search });
    return res.data.items?.map((i) => ({ id: i.id, name: i.name })) || [];
  } catch (error) {
    return [];
  }
}
export async function searchRefundPoints(search: string) {
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
