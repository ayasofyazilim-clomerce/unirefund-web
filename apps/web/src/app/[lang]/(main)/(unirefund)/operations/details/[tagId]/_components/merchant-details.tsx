"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { Store } from "lucide-react";
import Link from "next/link";
import { getBaseLink } from "src/utils";

function MerchantDetails({
  tagDetail,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
}) {
  return (
    <Card className="min-h-0 flex-1 rounded-none">
      <CardHeader className="py-6">
        <CardTitle className=" mb-4 flex items-center gap-2 text-2xl">
          <Store />
          Merchant details
        </CardTitle>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500">Store Name</div>
            <div className="w-2/3 ">
              <Link
                className="text-blue-700"
                href={
                  getBaseLink("parties/merchants/", true) +
                  tagDetail.merchant?.id
                }
              >
                {tagDetail.merchant?.name}
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500 ">Address</div>
            <div className=" w-2/3">
              {tagDetail.merchant?.address?.fullText}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500 ">Product Groups</div>
            <div className=" w-2/3">
              {tagDetail.merchant?.productGroups?.join(", ")}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default MerchantDetails;
