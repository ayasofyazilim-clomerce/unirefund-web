"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { Plane } from "lucide-react";
import Link from "next/link";
import { getBaseLink } from "src/utils";

function TravellerDetails({
  tagDetail,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
}) {
  return (
    <Card className="min-h-0 flex-1 rounded-none">
      <CardHeader className="py-6">
        <CardTitle className=" mb-4 flex items-center gap-2 text-2xl">
          <Plane />
          Traveller details
        </CardTitle>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500">Full Name</div>
            <div className="w-2/3 ">
              <Link
                className="text-blue-700"
                href={
                  getBaseLink("parties/travellers/", true) +
                  tagDetail.traveller?.id
                }
              >
                {`${tagDetail.traveller?.firstname} ${tagDetail.traveller?.lastname}`}
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500 ">
              Travel Document No:
            </div>
            <div className=" w-2/3">
              {tagDetail.traveller?.travelDocumentNumber}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500 ">
              Country of Residence
            </div>
            <div className=" w-2/3">
              {tagDetail.traveller?.countryOfResidence}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="w-1/3 text-sm text-gray-500 ">Nationality</div>
            <div className=" w-2/3">{tagDetail.traveller?.nationality}</div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default TravellerDetails;
