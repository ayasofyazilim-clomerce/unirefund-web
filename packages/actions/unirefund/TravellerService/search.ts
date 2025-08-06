"use server";

import {getTravellersApi} from "./actions";

export async function searchTravellers(search: string) {
  try {
    const res = await getTravellersApi({fullName: search});
    return res.data.items?.map((i) => ({id: i.id ?? "", name: i.fullName})) || [];
  } catch (error) {
    return [];
  }
}
