"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  $UniRefund_TagService_Tags_RefundType,
  $UniRefund_TagService_Tags_TagStatusType,
} from "@ayasofyazilim/saas/TagService";
import AsyncCommand from "@repo/ayasofyazilim-ui/molecules/async-command";
import { MultiSelect } from "@repo/ayasofyazilim-ui/molecules/multi-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { searchMerchants } from "src/actions/unirefund/CrmService/search";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

export default function Filter({
  languageData,
}: {
  languageData: TagServiceResource;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [statuses, setStatuses] = useState<string[]>(
    searchParams.get("statuses")?.split(",") || [],
  );
  const [merchantIds, setMerchantIds] = useState<string[]>(
    searchParams.get("merchantIds")?.split(",") || [],
  );
  const [refundTypes, setRefundTypes] = useState<string[]>(
    searchParams.get("refundTypes")?.split(",") || [],
  );
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("statuses", statuses.join(",") || "");
      params.set("merchantIds", merchantIds.join(",") || "");
      params.set("refundTypes", refundTypes.join(",") || "");

      const newParams = new URLSearchParams();
      params.forEach((value, key) => {
        if (value) {
          newParams.set(key, value);
        }
      });
      router.push(`${pathname}?${newParams.toString()}`);
    });
  }
  return (
    <Card>
      <CardHeader>Filters</CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid items-center gap-1.5">
          <Label htmlFor="refund-point">{languageData.Status}</Label>
          <MultiSelect
            onValueChange={setStatuses}
            options={$UniRefund_TagService_Tags_TagStatusType.enum.map(
              (status) => ({
                value: status,
                label: status,
              }),
            )}
          />
        </div>
        <div className="grid items-center gap-1.5">
          <Label htmlFor="refund-method">{languageData.RefundMethod}</Label>
          <MultiSelect
            onValueChange={setRefundTypes}
            options={$UniRefund_TagService_Tags_RefundType.enum.map(
              (status) => ({
                value: status,
                label: status,
              }),
            )}
          />
        </div>
        <div className="grid items-center gap-1.5">
          <Label htmlFor="merchants">Merchants</Label>
          <AsyncCommand
            fetchAction={searchMerchants}
            onSelectedItemsChange={setMerchantIds}
          />
        </div>
        <Button disabled={isPending} onClick={onSubmit} variant="default">
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}
