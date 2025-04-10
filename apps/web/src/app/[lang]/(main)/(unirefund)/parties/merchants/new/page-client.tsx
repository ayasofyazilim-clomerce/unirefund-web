"use client";

import type {UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto} from "@ayasofyazilim/saas/CRMService";
import SelectTabs, {SelectTabsContent} from "@repo/ayasofyazilim-ui/molecules/select-tabs";
import {Building2, User} from "lucide-react";
import {useState} from "react";
import type {CountryDto} from "@/utils/address-hook/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import MerchantOrganizationForm from "./_components/organization/form";
import MerchantIndividualForm from "./_components/individual/form";

type TabSection = "Organization" | "Individual";
export default function PageClientSide({
  taxOfficeList,
  countryList,
  languageData,
}: {
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const [activeTab, setActiveTab] = useState<TabSection>("Organization");

  return (
    <div className="my-6 rounded-md border p-6">
      <div className="mb-4">
        <SelectTabs
          onValueChange={(value) => {
            setActiveTab(value as TabSection);
          }}
          value={activeTab}>
          <SelectTabsContent value="Organization">
            <div className="flex flex-row items-center gap-1">
              <Building2 />
              Organization
            </div>
          </SelectTabsContent>
          <SelectTabsContent value="Individual">
            <div className="flex flex-row items-center gap-1">
              <User />
              Individual
            </div>
          </SelectTabsContent>
        </SelectTabs>
      </div>
      {activeTab === "Organization" ? (
        <MerchantOrganizationForm countryList={countryList} languageData={languageData} taxOfficeList={taxOfficeList} />
      ) : (
        <MerchantIndividualForm countryList={countryList} languageData={languageData} taxOfficeList={taxOfficeList} />
      )}
    </div>
  );
}
