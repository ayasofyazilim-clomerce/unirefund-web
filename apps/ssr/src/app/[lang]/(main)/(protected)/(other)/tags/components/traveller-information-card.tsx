import type {UniRefund_TagService_Travellers_TravellerDetailDto} from "@repo/saas/TagService";
import {User} from "lucide-react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

interface TravellerInformationCardProps {
  traveller?: UniRefund_TagService_Travellers_TravellerDetailDto | null;
  languageData: SSRServiceResource;
}

export function TravellerInformationCard({traveller, languageData}: TravellerInformationCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3 border-b pb-2">
        <User className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-800">{languageData["TravellerInformation.Title"]}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-gray-500">{languageData["TravellerInformation.FullName"]}</div>
          <div className="text-md font-semibold text-gray-800">
            {traveller?.firstname} {traveller?.lastname}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-gray-500">
              {languageData["TravellerInformation.PassportNumber"]}
            </div>
            <div className="text-md font-semibold text-gray-800">{traveller?.travellerDocumentNumber ?? "—"}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-gray-500">{languageData["TravellerInformation.Nationality"]}</div>
            <div className="text-md font-semibold text-gray-800">{traveller?.nationality ?? "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
