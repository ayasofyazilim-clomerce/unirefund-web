"use server";

import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { getTaxOfficesApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { getCountriesApi } from "../../../../../../../actions/unirefund/LocationService/actions";
import type { PartyNameType } from "../../types";
import PageClientSide from "./page-client";

export default async function Page({
  params,
}: {
  params: {
    partyName: PartyNameType;
    lang: string;
  };
}) {
  const { partyName } = params;
  const { languageData } = await getResourceData(params.lang);

  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  const taxOffices = await getTaxOfficesApi();
  const taxOfficeList =
    (taxOffices.type === "success" && taxOffices.data.items) || [];

  return (
    <FormReadyComponent
      active={
        taxOfficeList.length === 0 &&
        partyName !== "tax-offices" &&
        (partyName === "refund-points" || partyName === "merchants")
      }
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.TaxOffices.Title"],
        message: languageData["Missing.TaxOffices.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href="../tax-offices/new">
              {languageData["TaxOffices.New"]}
            </Link>
          </Button>
        ),
      }}
    >
      <PageClientSide
        countryList={countryList}
        languageData={languageData}
        partyName={params.partyName}
        taxOfficeList={taxOfficeList}
      />
    </FormReadyComponent>
  );
}
