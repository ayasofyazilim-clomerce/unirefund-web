import type {UniRefund_CRMService_Merchants_MerchantInfoForTagDto} from "@repo/saas/TagService";
import {Store} from "lucide-react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

interface MerchantInformationCardProps {
  merchant?: UniRefund_CRMService_Merchants_MerchantInfoForTagDto | null;
  languageData: SSRServiceResource;
}

export function MerchantInformationCard({merchant, languageData}: MerchantInformationCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3 border-b pb-2">
        <Store className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-800">{languageData["MerchantInformation.Title"]}</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium text-gray-500">{languageData["MerchantInformation.Name"]}</div>
          <div className="text-md font-semibold text-gray-800">{merchant?.name ?? "—"}</div>
        </div>
        {merchant?.address ? <div className="">
            <div className="text-sm font-medium text-gray-500">{languageData["MerchantInformation.Address"]}</div>
            <div className="text-md font-semibold text-gray-800">{merchant.address.addressLine}</div>
          </div> : null}
      </div>
    </div>
  );
}
