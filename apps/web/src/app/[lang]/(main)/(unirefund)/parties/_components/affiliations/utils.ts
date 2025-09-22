import {
  deleteCustomAffiliationByIdApi,
  deleteMerchantAffiliationByIdApi,
  deleteRefundPointAffiliationByIdApi,
  deleteTaxFreeAffiliationByIdApi,
  deleteTaxOfficeAffiliationByIdApi,
} from "@repo/actions/unirefund/CrmService/delete-actions";
import {
  postCustomAffiliationApi,
  postMerchantAffiliationApi,
  postRefundPointAffiliationApi,
  postTaxFreeAffiliationApi,
  postTaxOfficesAffiliationApi,
} from "@repo/actions/unirefund/CrmService/post-actions";
import {
  putCustomAffiliationByIdApi,
  putMerchantAffiliationByIdApi,
  putRefundPointAffiliationByIdApi,
  putTaxFreeAffiliationByIdApi,
  putTaxOfficeAffiliationByIdApi,
} from "@repo/actions/unirefund/CrmService/put-actions";
import type {
  UniRefund_CRMService_Affiliations_CreatePartyAffiliationDto,
  UniRefund_CRMService_Affiliations_UpdateAffiliationDto,
} from "@repo/saas/CRMService";
import {handleDeleteResponse, handlePostResponse, handlePutResponse} from "@repo/utils/api";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {PartyTypeHasAffiliations} from "../party-header";

export function createAffiliationByPartyType({
  partyId: id,
  partyType,
  requestBody,
  router,
}: {
  partyId: string;
  partyType: PartyTypeHasAffiliations;
  requestBody: UniRefund_CRMService_Affiliations_CreatePartyAffiliationDto;
  router: AppRouterInstance;
}) {
  switch (partyType) {
    case "merchants":
      void postMerchantAffiliationApi({id, requestBody}).then((res) => {
        handlePostResponse(res, router);
      });
      break;
    case "refund-points":
      void postRefundPointAffiliationApi({id, requestBody}).then((res) => {
        handlePostResponse(res, router);
      });
      break;
    case "tax-offices":
      void postTaxOfficesAffiliationApi({id, requestBody}).then((res) => {
        handlePostResponse(res, router);
      });
      break;
    case "tax-free":
      void postTaxFreeAffiliationApi({id, requestBody}).then((res) => {
        handlePostResponse(res, router);
      });
      break;
    case "customs":
      void postCustomAffiliationApi({id, requestBody}).then((res) => {
        handlePostResponse(res, router);
      });
      break;
  }
}

export function updateAffiliationByPartyType({
  partyId,
  partyType,
  requestBody,
  affiliationId,
  router,
}: {
  partyId: string;
  partyType: PartyTypeHasAffiliations;
  requestBody: UniRefund_CRMService_Affiliations_UpdateAffiliationDto;
  affiliationId: string;
  router: AppRouterInstance;
}) {
  switch (partyType) {
    case "merchants":
      void putMerchantAffiliationByIdApi({merchantId: partyId, affiliationId, requestBody}).then((res) => {
        handlePutResponse(res, router);
      });
      break;
    case "refund-points":
      void putRefundPointAffiliationByIdApi({refundPointId: partyId, affiliationId, requestBody}).then((res) => {
        handlePutResponse(res, router);
      });
      break;
    case "tax-offices":
      void putTaxOfficeAffiliationByIdApi({taxOfficeId: partyId, affiliationId, requestBody}).then((res) => {
        handlePutResponse(res, router);
      });
      break;
    case "tax-free":
      void putTaxFreeAffiliationByIdApi({taxFreeId: partyId, affiliationId, requestBody}).then((res) => {
        handlePutResponse(res, router);
      });
      break;
    case "customs":
      void putCustomAffiliationByIdApi({customId: partyId, affiliationId, requestBody}).then((res) => {
        handlePutResponse(res, router);
      });
      break;
  }
}
export function deleteAffiliationByPartyType({
  partyId,
  partyType,
  affiliationId,
  router,
}: {
  partyId: string;
  partyType: PartyTypeHasAffiliations;
  affiliationId: string;
  router: AppRouterInstance;
}) {
  switch (partyType) {
    case "merchants":
      void deleteMerchantAffiliationByIdApi({merchantId: partyId, affiliationId}).then((res) => {
        handleDeleteResponse(res, router);
      });
      break;
    case "refund-points":
      void deleteRefundPointAffiliationByIdApi({refundPointId: partyId, affiliationId}).then((res) => {
        handleDeleteResponse(res, router);
      });
      break;
    case "tax-offices":
      void deleteTaxOfficeAffiliationByIdApi({taxOfficeId: partyId, affiliationId}).then((res) => {
        handleDeleteResponse(res, router);
      });
      break;
    case "tax-free":
      void deleteTaxFreeAffiliationByIdApi({taxFreeId: partyId, affiliationId}).then((res) => {
        handleDeleteResponse(res, router);
      });
      break;
    case "customs":
      void deleteCustomAffiliationByIdApi({customId: partyId, affiliationId}).then((res) => {
        handleDeleteResponse(res, router);
      });
      break;
  }
}
