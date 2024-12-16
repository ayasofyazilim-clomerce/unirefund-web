"use client";

import { toast } from "@/components/ui/sonner";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { PartyNameType } from "../../types";
import { putParty } from "./action";
import type {
  PutAddress,
  PutEmail,
  PutMerchantBase,
  PutName,
  PutOrganization,
  PutPersonalSummaries,
  PutTelephone,
} from "./types";

export async function handleUpdateSubmit(
  partyName: Exclude<PartyNameType, "individuals">,
  putData:
    | PutOrganization
    | PutTelephone
    | PutAddress
    | PutEmail
    | PutName
    | PutPersonalSummaries
    | PutMerchantBase,
  router: AppRouterInstance,
) {
  const response = await putParty(partyName, putData);
  if (response.type === "success") {
    toast.success("Updated successfully");
    router.refresh();
  } else {
    toast.error(response.message);
  }
}
