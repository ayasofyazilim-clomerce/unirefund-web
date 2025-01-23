"use server";

import type {
  GetApiPermissionManagementPermissionsData,
  PutApiPermissionManagementPermissionsData,
} from "@ayasofyazilim/saas/AdministrationService";
import type {
  GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdRebateSettingsData,
  PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
  PutApiContractServiceMerchantsContractsContractHeadersByIdData,
  PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
  PutApiContractServiceMerchantsContractsContractSettingsByIdData,
  PutApiContractServiceRefundPointsContractsContractHeadersByIdData,
} from "@ayasofyazilim/saas/ContractService";
import type {
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsByIdAffiliationsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceRefundPointsData,
  GetApiCrmServiceTaxFreesData,
  GetApiCrmServiceTaxOfficesData,
  PostApiCrmServiceCustomsByIdAffiliationsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
  PostApiCrmServiceRefundPointsByIdAffiliationsData,
  PostApiCrmServiceTaxFreesByIdAffiliationsData,
  PostApiCrmServiceTaxOfficesByIdAffiliationsData,
  PutApiCrmServiceCustomsByIdEmailsByEmailIdData,
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
} from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiIdentityClaimTypesData,
  GetApiIdentityRolesByIdClaimsData,
  GetApiIdentityRolesData,
  GetApiIdentitySessionsData,
  GetApiIdentityUsersByIdClaimsData,
  GetApiIdentityUsersData,
  GetApiOpeniddictApplicationsByIdTokenLifetimeData,
  PutApiIdentityRolesByIdClaimsData,
  PutApiIdentityRolesByIdMoveAllUsersData,
  PutApiIdentityUsersByIdChangePasswordData,
  PutApiIdentityUsersByIdClaimsData,
  PutApiIdentityUsersByIdTwoFactorByEnabledData,
  PutApiOpeniddictApplicationsByIdTokenLifetimeData,
} from "@ayasofyazilim/saas/IdentityService";
import type {
  GetApiLocationServiceCitiesData,
  GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
  GetApiLocationServiceCountriesData,
  GetApiLocationServiceDistrictsGetListByCityByCityIdData,
  GetApiLocationServiceNeighborhoodsGetListByDistrictByDistrictIdData,
  GetApiLocationServiceRegionsGetDefaultRegionIdByCountryIdData,
  GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
} from "@ayasofyazilim/saas/LocationService";
import type { GetApiRefundServiceRefundsData } from "@ayasofyazilim/saas/RefundService";
import type {
  PutApiSaasEditionsByIdMoveAllTenantsData,
  PutApiSaasTenantsByIdSetPasswordData,
} from "@ayasofyazilim/saas/SaasService";
import type { GetApiTagServiceTagData } from "@ayasofyazilim/saas/TagService";
import type { FilterColumnResult } from "@repo/ayasofyazilim-ui/molecules/tables/types";
import { auth } from "@repo/utils/auth/next-auth";
import {
  getAdministrationServiceClient,
  getContractServiceClient,
  getCRMServiceClient,
  getIdentityServiceClient,
  getLocationServiceClient,
  getRefundServiceClient,
  getSaasServiceClient,
  getTagServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export type ApiRequestTypes = keyof Awaited<ReturnType<typeof getApiRequests>>;
export type GetTableDataTypes = Exclude<
  ApiRequestTypes,
  | "locations"
  | "editions"
  | "applications"
  | "tenants"
  | "templates"
  | "permissions"
>;
export type DeleteTableDataTypes = Exclude<
  ApiRequestTypes,
  | "claims"
  | "roles"
  | "locations"
  | "users"
  | "tags"
  | "editions"
  | "applications"
  | "tenants"
  | "refund"
  | "templates"
  | "permissions"
>;
export type GetDetailTableDataTypes = Exclude<
  ApiRequestTypes,
  | "claims"
  | "roles"
  | "locations"
  | "users"
  | "tags"
  | "editions"
  | "applications"
  | "tenants"
  | "refund"
  | "sessions"
  | "templates"
  | "permissions"
>;

export async function getApiRequests() {
  const session = await auth();
  const crmClient = await getCRMServiceClient(session);
  const contractsClient = await getContractServiceClient(session);
  const locationClient = await getLocationServiceClient(session);
  const identityClient = await getIdentityServiceClient(session);
  const saasClient = await getSaasServiceClient(session);
  const tagClient = await getTagServiceClient(session);
  const refundClient = await getRefundServiceClient(session);
  const administrationClient = await getAdministrationServiceClient(session);
  const tableRequests = {
    merchants: {
      getDetail: async (id: string) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdDetail({ id }),
      get: async (data: GetApiCrmServiceMerchantsData) =>
        await crmClient.merchant.getApiCrmServiceMerchants(data),
      getById: async (id: string) =>
        await crmClient.merchant.getApiCrmServiceMerchantsById({ id }),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdSubMerchants(
          data,
        ),
      getIndivuals: async (
        data: GetApiCrmServiceMerchantsByIdAffiliationsData,
      ) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.merchant.deleteApiCrmServiceMerchantsByIdWithComponents(
          { id },
        ),

      getAdresses: async (data: { id: string }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdAddresses(data),
      getContractHeadersByMerchantId: async (
        data: GetApiContractServiceMerchantsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsByIdContractsContractHeaders(
          data,
        ),
      postContractHeadersById: async (
        data: PostApiContractServiceMerchantsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsByIdContractsContractHeaders(
          data,
        ),
      putContractHeadersById: async (
        data: PutApiContractServiceMerchantsContractsContractHeadersByIdData,
      ) =>
        await contractsClient.contractsMerchant.putApiContractServiceMerchantsContractsContractHeadersById(
          data,
        ),
      getContractHeaderById: async (id: string) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersById(
          { id },
        ),
      putContractSettingsById: async (
        data: PutApiContractServiceMerchantsContractsContractSettingsByIdData,
      ) =>
        await contractsClient.contractsMerchant.putApiContractServiceMerchantsContractsContractSettingsById(
          data,
        ),
      deleteContractHeadersById: async (id: string) =>
        await contractsClient.contractsMerchant.deleteApiContractServiceMerchantsContractsContractHeadersById(
          { id },
        ),
      deleteContractSettingsById: async (id: string) =>
        await contractsClient.contractsMerchant.deleteApiContractServiceMerchantsContractsContractSettingsById(
          { id },
        ),
      getContractHeadersContractStoresByHeaderId: async (
        data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
      ) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractStores(
          data,
        ),
      postContractHeadersContractStoresByHeaderId: async (
        data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractStoresData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractStores(
          data,
        ),
      getContractHeaderContractSettingsByHeaderId: async (
        data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
      ) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
          data,
        ),
      postContractHeaderContractSettingsByHeaderId: async (
        data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
          data,
        ),
      putContractHeaderSetDefaultContractSettingByHeaderId: async (
        data: PutApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSettingData,
      ) =>
        await contractsClient.contractsMerchant.putApiContractServiceMerchantsContractsContractHeadersByIdSetDefaultSetting(
          data,
        ),
      postContractHeaderRebateSettingByHeaderId: async (
        data: PostApiContractServiceMerchantsContractsContractHeadersByIdRebateSettingsData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdRebateSettings(
          data,
        ),
      postContractHeaderValidateByHeaderId: async (id: string) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdValidate(
          { id },
        ),
      putMerchantBase: async (data: PutApiCrmServiceMerchantsByIdData) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsById({
          requestBody: data.requestBody,
          id: data.id,
        });
      },
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdAddressesByAddressId(
          data,
        );
      },

      putEmailAddress: async (
        data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      putIndividualName: async (
        data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameId(
          data,
        );
      },
      putIndividualPersonalSummary: async (
        data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceMerchantsByIdAffiliationsData,
      ) => {
        return await crmClient.merchant.postApiCrmServiceMerchantsByIdAffiliations(
          data,
        );
      },
    },
    "refund-points": {
      getDetail: async (id: string) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdDetail({
          id,
        }),
      get: async (data: GetApiCrmServiceRefundPointsData) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPoints(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdSubRefundPoints(
          data,
        ),
      getIndivuals: async (
        data: GetApiCrmServiceMerchantsByIdAffiliationsData,
      ) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.refundPoint.deleteApiCrmServiceRefundPointsByIdWithComponents(
          {
            id,
          },
        ),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceRefundPointsByIdAffiliationsData,
      ) => {
        return await crmClient.refundPoint.postApiCrmServiceRefundPointsByIdAffiliations(
          data,
        );
      },
      getContractHeadersByRefundPointId: async (
        data: GetApiContractServiceRefundPointsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsRefundPoint.getApiContractServiceRefundPointsByIdContractsContractHeaders(
          data,
        ),
      postContractHeadersById: async (
        data: PostApiContractServiceRefundPointsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsRefundPoint.postApiContractServiceRefundPointsByIdContractsContractHeaders(
          data,
        ),
      putContractHeadersById: async (
        data: PutApiContractServiceRefundPointsContractsContractHeadersByIdData,
      ) =>
        await contractsClient.contractsRefundPoint.putApiContractServiceRefundPointsContractsContractHeadersById(
          data,
        ),
      getContractHeaderById: async (id: string) =>
        await contractsClient.contractsRefundPoint.getApiContractServiceRefundPointsContractsContractHeadersById(
          { id },
        ),
      deleteContractHeadersById: async (id: string) =>
        await contractsClient.contractsRefundPoint.deleteApiContractServiceRefundPointsContractsContractHeadersById(
          { id },
        ),
      postContractHeaderValidateByHeaderId: async (id: string) =>
        await contractsClient.contractsRefundPoint.postApiContractServiceRefundPointsContractsContractHeadersByIdValidate(
          { id },
        ),
    },
    customs: {
      getDetail: async (id: string) =>
        await crmClient.customs.getApiCrmServiceCustomsByIdDetail({ id }),
      get: async (data: GetApiCrmServiceCustomsData) =>
        await crmClient.customs.getApiCrmServiceCustoms(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) => await crmClient.customs.getApiCrmServiceCustomsByIdSubCustoms(data),
      getIndivuals: async (
        data: GetApiCrmServiceMerchantsByIdAffiliationsData,
      ) =>
        await crmClient.customs.getApiCrmServiceCustomsByIdAffiliations(data),
      deleteRow: async (id: string) =>
        await crmClient.customs.deleteApiCrmServiceCustomsByIdWithComponents({
          id,
        }),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceCustomsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceCustomsByIdAffiliationsData,
      ) => {
        return await crmClient.customs.postApiCrmServiceCustomsByIdAffiliations(
          data,
        );
      },
    },
    "tax-free": {
      getDetail: async (id: string) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdDetail({ id }),
      get: async (data: GetApiCrmServiceTaxFreesData) =>
        await crmClient.taxFree.getApiCrmServiceTaxFrees(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdSubTaxFree(data),
      getIndivuals: async (
        data: GetApiCrmServiceMerchantsByIdAffiliationsData,
      ) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdAffiliations(data),

      deleteRow: async (id: string) =>
        await crmClient.taxFree.deleteApiCrmServiceTaxFreesByIdWithComponents({
          id,
        }),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceTaxFreesByIdAffiliationsData,
      ) => {
        return await crmClient.taxFree.postApiCrmServiceTaxFreesByIdAffiliations(
          data,
        );
      },
    },
    "tax-offices": {
      getDetail: async (id: string) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdDetail({ id }),
      get: async (data: GetApiCrmServiceTaxOfficesData = {}) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOffices(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdSubTaxOffices(
          data,
        ),
      getIndivuals: async (
        data: GetApiCrmServiceMerchantsByIdAffiliationsData,
      ) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesByIdWithComponents(
          {
            id,
          },
        ),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceTaxOfficesByIdAffiliationsData,
      ) => {
        return await crmClient.taxOffice.postApiCrmServiceTaxOfficesByIdAffiliations(
          data,
        );
      },
    },
    individuals: {
      getDetail: async (id: string) =>
        await crmClient.individual.getApiCrmServiceIndividualsById({ id }),
      get: async (data: GetApiCrmServiceIndividualsData) =>
        await crmClient.individual.getApiCrmServiceIndividuals(data),
      deleteRow: async (id: string) =>
        await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesByIdWithComponents(
          {
            id,
          },
        ),
      getAffiliationCode: async () =>
        await crmClient.affiliationCode.getApiCrmServiceAffiliationCodes(),
    },
    locations: {
      getCountries: async (data: GetApiLocationServiceCountriesData) =>
        await locationClient.country.getApiLocationServiceCountries(data),
      getRegionsByCountryId: async (
        data: GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
      ) =>
        await locationClient.region.getApiLocationServiceRegionsGetListByCountryByCountryId(
          data,
        ),
      getDefaultRegionsByCountryId: async (
        data: GetApiLocationServiceRegionsGetDefaultRegionIdByCountryIdData,
      ) =>
        await locationClient.region.getApiLocationServiceRegionsGetDefaultRegionIdByCountryId(
          data,
        ),
      getCitiesByRegionId: async (
        data: GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
      ) =>
        await locationClient.city.getApiLocationServiceCitiesGetListByRegionByRegionId(
          data,
        ),

      getCities: async (
        data: GetApiLocationServiceCitiesData, //this should be removed when the forms updated
      ) => await locationClient.city.getApiLocationServiceCities(data),
      getDistrictsByCityId: async (
        data: GetApiLocationServiceDistrictsGetListByCityByCityIdData, //this should be removed when the forms updated
      ) =>
        await locationClient.district.getApiLocationServiceDistrictsGetListByCityByCityId(
          data,
        ),
      getNeighborhoodsByDistrictId: async (
        data: GetApiLocationServiceNeighborhoodsGetListByDistrictByDistrictIdData, //this should be removed when the forms updated
      ) =>
        await locationClient.neighborhood.getApiLocationServiceNeighborhoodsGetListByDistrictByDistrictId(
          data,
        ),
    },
    refund: {
      get: async (data: GetApiRefundServiceRefundsData) =>
        await refundClient.refund.getApiRefundServiceRefunds(data),
    },
    claims: {
      get: async (data: GetApiIdentityClaimTypesData) =>
        await identityClient.claimType.getApiIdentityClaimTypes(data),
    },
    roles: {
      get: async (data: GetApiIdentityRolesData) =>
        await identityClient.role.getApiIdentityRoles(data),
      getRoleClaims: async (data: GetApiIdentityRolesByIdClaimsData) =>
        await identityClient.role.getApiIdentityRolesByIdClaims(data),
      putRoleClaims: async (data: PutApiIdentityRolesByIdClaimsData) =>
        await identityClient.role.putApiIdentityRolesByIdClaims(data),
      getAllRoles: async () =>
        await identityClient.role.getApiIdentityRolesAll(),
      MoveAllUsers: async (data: PutApiIdentityRolesByIdMoveAllUsersData) =>
        await identityClient.role.putApiIdentityRolesByIdMoveAllUsers(data),
    },
    users: {
      get: async (data: GetApiIdentityUsersData) =>
        await identityClient.user.getApiIdentityUsers(data),
      getUserClaims: async (data: GetApiIdentityUsersByIdClaimsData) =>
        await identityClient.user.getApiIdentityUsersByIdClaims(data),
      getTwoFactorEnable: async (id: string) =>
        await identityClient.user.getApiIdentityUsersByIdTwoFactorEnabled({
          id,
        }),
      getUserOrganization: async (id: string) =>
        await identityClient.user.getApiIdentityUsersByIdOrganizationUnits({
          id,
        }),
      putUserClaims: async (data: PutApiIdentityUsersByIdClaimsData) =>
        await identityClient.user.putApiIdentityUsersByIdClaims(data),
      putChangePassword: async (
        data: PutApiIdentityUsersByIdChangePasswordData,
      ) =>
        await identityClient.user.putApiIdentityUsersByIdChangePassword(data),
      putTwoFactorEnable: async (
        data: PutApiIdentityUsersByIdTwoFactorByEnabledData,
      ) =>
        await identityClient.user.putApiIdentityUsersByIdTwoFactorByEnabled(
          data,
        ),
    },
    sessions: {
      get: async (data: GetApiIdentitySessionsData) =>
        await identityClient.sessions.getApiIdentitySessions(data),
      deleteRow: async (id: string) =>
        await identityClient.sessions.deleteApiIdentitySessionsById({
          id,
        }),
    },
    permissions: {
      getPermissions: async (data: GetApiPermissionManagementPermissionsData) =>
        await administrationClient.permissions.getApiPermissionManagementPermissions(
          data,
        ),
      putPermissions: async (data: PutApiPermissionManagementPermissionsData) =>
        await administrationClient.permissions.putApiPermissionManagementPermissions(
          data,
        ),
    },
    tenants: {
      putSetPassword: async (data: PutApiSaasTenantsByIdSetPasswordData) =>
        await saasClient.tenant.putApiSaasTenantsByIdSetPassword(data),
    },
    editions: {
      getAllEditions: async () =>
        await saasClient.edition.getApiSaasEditionsAll(),
      moveAllTenants: async (data: PutApiSaasEditionsByIdMoveAllTenantsData) =>
        await saasClient.edition.putApiSaasEditionsByIdMoveAllTenants(data),
    },
    tags: {
      get: async (data: GetApiTagServiceTagData) =>
        await tagClient.tag.getApiTagServiceTag(data),
    },
    applications: {
      getTokenLifetime: async (
        data: GetApiOpeniddictApplicationsByIdTokenLifetimeData,
      ) =>
        await identityClient.applications.getApiOpeniddictApplicationsByIdTokenLifetime(
          data,
        ),
      putTokenLifetime: async (
        data: PutApiOpeniddictApplicationsByIdTokenLifetimeData,
      ) =>
        await identityClient.applications.putApiOpeniddictApplicationsByIdTokenLifetime(
          data,
        ),
    },
  };
  return tableRequests;
}
export async function getTableData(
  type: GetTableDataTypes,
  page = 0,
  maxResultCount = 10,
  filter?: FilterColumnResult,
) {
  try {
    const requests = await getApiRequests();
    const data = await requests[type].get({
      maxResultCount,
      skipCount: page * 10,
      ...filter,
    });
    return structuredResponse(data);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteTableRow(type: DeleteTableDataTypes, id: string) {
  try {
    const requests = await getApiRequests();
    const response = await requests[type].deleteRow(id);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTableDataDetail(
  type: GetDetailTableDataTypes,
  id: string,
) {
  try {
    const requests = await getApiRequests();
    const data = await requests[type].getDetail(id);
    return structuredResponse(data);
  } catch (error) {
    return structuredError(error);
  }
}
