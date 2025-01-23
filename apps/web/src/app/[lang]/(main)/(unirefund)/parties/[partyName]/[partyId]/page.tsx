"use server";

import type {
  GetApiCrmServiceMerchantsByIdDetailResponse,
  UniRefund_CRMService_Merchants_UpdateMerchantDto,
} from "@ayasofyazilim/saas/CRMService";
import { SectionLayout } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { notFound } from "next/navigation";
import { getTableDataDetail } from "src/actions/api-requests";
import { getAssignableRolesByCurrentUserApi } from "src/actions/core/IdentityService/actions";
import {
  getMerchantContractHeadersByMerchantIdApi,
  getRefundPointContractHeadersByRefundPointIdApi,
} from "src/actions/unirefund/ContractService/action";
import {
  getAffiliationCodeApi,
  getIndividualsByIdApi,
  getMerchantsApi,
  getMerchantsByIdProductGroupApi,
  getTaxOfficesApi,
} from "src/actions/unirefund/CrmService/actions";
import type { PartyNameType } from "src/actions/unirefund/CrmService/types";
import { partyNameToEntityPartyTypeCode } from "src/actions/unirefund/CrmService/types";
import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData as getContractsResourceData } from "src/language-data/unirefund/ContractService";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getProductGroupsApi } from "src/actions/unirefund/SettingService/actions";
import { dataConfigOfParties } from "../../table-data";
import Address from "./_components/address/form";
import Email from "./_components/email/form";
import IndividualTable from "./_components/individuals-table/table";
import MerchantForm from "./_components/merchant/form";
import NameForm from "./_components/name/form";
import OrganizationForm from "./_components/organization/form";
import PersonalSummariesForm from "./_components/personal-summaries/form";
import ProductGroups from "./_components/product-groups/table";
import SubCompany from "./_components/subcompanies-table/form";
import Contracts from "./contracts/table";
import Telephone from "./contracts/telephone/form";
import type { GetPartiesDetailResult } from "./types";

interface SearchParamType {
  affiliationCodeId?: number;
  email?: string;
  entityInformationTypeCode?: "INDIVIDUAL" | "ORGANIZATION";
  id: string;
  maxResultCount?: number;
  name?: string;
  skipCount?: number;
  sorting?: string;
  telephone?: string;
}

async function getPartyDetail(
  partyName: Exclude<PartyNameType, "individuals">,
  partyId: string,
) {
  if (partyName === "merchants") {
    const response = await getTableDataDetail("merchants", partyId);
    if (response.type === "success") {
      const data = response.data as GetApiCrmServiceMerchantsByIdDetailResponse;
      return {
        detail: data.merchant,
        message: response.message,
      };
    }
    return {
      detail: null,
      message: response.message,
    };
  }
  const response = await getTableDataDetail(partyName, partyId);
  if (response.type === "success") {
    const data = response.data as GetPartiesDetailResult;
    return {
      detail: data,
      message: response.message,
    };
  }
  return {
    detail: null,
    message: response.message,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    partyId: string;
    partyName: Exclude<PartyNameType, "individuals">;
    lang: string;
  };
  searchParams: SearchParamType;
}) {
  const { lang, partyName, partyId } = params;
  const { languageData } = await getResourceData(lang);
  const { languageData: contractsLanguageData } =
    await getContractsResourceData(lang);
  const formData = dataConfigOfParties[partyName];

  const partyDetailResponse = await getPartyDetail(partyName, partyId);

  if (!partyDetailResponse.detail) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={partyDetailResponse.message}
      />
    );
  }

  const partyDetailData = partyDetailResponse.detail;

  const organizationData =
    partyDetailData.entityInformations?.[0]?.organizations?.[0];
  const individualData =
    partyDetailData.entityInformations?.[0]?.individuals?.[0];
  if (!organizationData && !individualData) {
    return notFound();
  }

  const countries = await getCountriesApi();
  const countryList =
    (countries.type === "success" && countries.data.items) || [];

  const merchants = await getMerchantsApi();

  const merchantList =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TODO: we need to fix this
    (merchants.type === "success" &&
      merchants.data.items?.filter((merchant) => merchant.id !== partyId)) ||
    [];

  let contracts;
  if (partyName === "refund-points") {
    contracts = await getRefundPointContractHeadersByRefundPointIdApi({
      id: partyId,
    });
  }
  if (partyName === "merchants") {
    contracts = await getMerchantContractHeadersByMerchantIdApi({
      id: partyId,
    });
  }
  const taxOffices = await getTaxOfficesApi();
  const taxOfficeList = // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- TODO: we need to fix this
    (taxOffices.type === "success" && taxOffices.data.items) || [];

  const sections = [
    { name: languageData.Telephone, id: "telephone" },
    { name: languageData.Address, id: "address" },
    { name: languageData.Email, id: "email" },
    { name: languageData[formData.subEntityName], id: "SubCompany" },
    { name: languageData.Individuals, id: "individuals" },
    { name: "Product Groups", id: "product-groups" },
  ];

  if (organizationData) {
    sections.unshift({
      name: languageData["Parties.Organization"],
      id: "organization",
    });
  } else {
    sections.unshift({
      name: languageData.PersonalSummaries,
      id: "personal-summaries",
    });
    sections.unshift({ name: languageData.Name, id: "name" });
  }
  if (partyName === "merchants") {
    sections.unshift({
      name: languageData.Merchants,
      id: "merchant-base",
    });
  }
  if (partyName === "refund-points" || partyName === "merchants") {
    sections.push({ name: languageData.Contracts, id: "contracts" });
  }

  const individualsResponse = await getIndividualsByIdApi(partyName, {
    ...searchParams,
    id: partyId,
  });
  const individuals =
    individualsResponse.type === "success"
      ? individualsResponse.data
      : { items: [], totalCount: 0 };

  const affiliationCodesResponse = await getAffiliationCodeApi({
    entityPartyTypeCode: partyNameToEntityPartyTypeCode[partyName],
  });

  const assignableRolesResponse = await getAssignableRolesByCurrentUserApi();
  const assignableRoles =
    assignableRolesResponse.type === "success"
      ? assignableRolesResponse.data
      : [];

  const affiliationCodes =
    affiliationCodesResponse.type === "success"
      ? affiliationCodesResponse.data.items?.filter((a) =>
          assignableRoles.find((r) => r.isAssignable && r.roleId === a.roleId),
        ) || []
      : [];

  const merchantProductGroupsResponse =
    await getMerchantsByIdProductGroupApi(partyId);
  if (isErrorOnRequest(merchantProductGroupsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={merchantProductGroupsResponse.message}
      />
    );
  }
  const productGroupsResponse = await getProductGroupsApi({
    maxResultCount: 1000,
  });
  if (isErrorOnRequest(productGroupsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={productGroupsResponse.message}
      />
    );
  }

  return (
    <>
      <div className="h-full overflow-hidden">
        <SectionLayout sections={sections} vertical>
          {partyName === "merchants" && (
            <ProductGroups
              languageData={languageData}
              merchantProductGroupsList={merchantProductGroupsResponse.data}
              productGroupsList={productGroupsResponse.data.items || []}
            />
          )}
          {partyName === "merchants" &&
          "taxOfficeId" in partyDetailData &&
          partyDetailData.taxpayerId ? (
            <MerchantForm
              languageData={languageData}
              merchantBaseData={
                partyDetailData as UniRefund_CRMService_Merchants_UpdateMerchantDto // #1099
              }
              merchantList={merchantList}
              partyId={partyId}
              partyName={partyName}
              taxOfficeList={taxOfficeList}
            />
          ) : null}

          {organizationData ? (
            <OrganizationForm
              languageData={languageData}
              organizationData={organizationData}
              organizationId={organizationData.id || ""}
              partyId={partyId}
              partyName={partyName}
            />
          ) : null}

          {partyName === "merchants" && individualData ? (
            <>
              <NameForm
                individualData={individualData.name}
                languageData={languageData}
                partyId={partyId}
                partyName={partyName}
              />
              <PersonalSummariesForm
                individualData={individualData.personalSummaries?.[0]}
                languageData={languageData}
                partyId={partyId}
                partyName={partyName}
              />
            </>
          ) : null}

          <Telephone
            languageData={languageData}
            organizationData={organizationData || individualData}
            partyId={partyId}
            partyName={partyName}
          />

          <Address
            countryList={countryList}
            languageData={languageData}
            organizationData={organizationData || individualData}
            partyId={partyId}
            partyName={partyName}
          />

          <Email
            languageData={languageData}
            organizationData={organizationData || individualData}
            partyId={partyId}
            partyName={partyName}
          />
          <SubCompany
            languageData={languageData}
            partyId={partyId}
            partyName={partyName}
          />
          <IndividualTable
            affiliationCodes={affiliationCodes}
            languageData={languageData}
            locale={lang}
            partyId={partyId}
            partyName={partyName}
            response={individuals}
          />

          {contracts &&
          (partyName === "merchants" || partyName === "refund-points") ? (
            <Contracts
              contractsData={
                contracts.type === "success" ? contracts.data : { items: [] }
              }
              lang={lang}
              languageData={{ ...languageData, ...contractsLanguageData }}
              partyId={partyId}
              partyName={partyName}
            />
          ) : null}
        </SectionLayout>
      </div>
      <div className="hidden" id="page-title">
        {`${languageData[formData.translationKey]} (${partyDetailData.entityInformations?.[0]?.organizations?.[0]?.name || `${individualData?.name?.firstName} ${individualData?.name?.lastName}`})`}
      </div>
    </>
  );
}
