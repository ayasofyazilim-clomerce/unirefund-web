"use client";

import SelectTabs, {
  SelectTabsContent,
} from "@repo/ayasofyazilim-ui/molecules/select-tabs";
import { Building2, User } from "lucide-react";
import { useState } from "react";
import type { UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import type { PartyNameType } from "../../types";
import CrmIndividual from "./crm/individual/form";
import CrmOrganization from "./crm/organization/form";
import Individual from "./individual/form";

type TabSection = "Organization" | "Individual";
export default function PageClientSide({
  partyName,
  taxOfficeList,
  countryList,
  languageData,
}: {
  partyName: PartyNameType;
  taxOfficeList: UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto[];
  countryList: CountryDto[];
  languageData: CRMServiceServiceResource;
}) {
  const [activeTab, setActiveTab] = useState<TabSection>("Organization");

  if (partyName === "individuals") {
    return (
      <Individual
        countryList={countryList}
        languageData={languageData}
        partyName={partyName}
      />
    );
  }

  if (partyName !== "merchants") {
    return (
      <CrmOrganization
        countryList={countryList}
        languageData={languageData}
        partyName={partyName}
        taxOfficeList={taxOfficeList}
      />
    );
  }
  return (
    <>
      <div className="mb-3">
        <SelectTabs
          onValueChange={(value) => {
            setActiveTab(value as TabSection);
          }}
          value={activeTab}
        >
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
        <CrmOrganization
          countryList={countryList}
          languageData={languageData}
          partyName={partyName}
          taxOfficeList={taxOfficeList}
        />
      ) : (
        <CrmIndividual
          countryList={countryList}
          languageData={languageData}
          partyName={partyName}
          taxOfficeList={taxOfficeList}
        />
      )}
    </>
  );
}
