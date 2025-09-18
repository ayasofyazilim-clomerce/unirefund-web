import {toast} from "@/components/ui/sonner";
import {
  putCustomAddressesByIdApi,
  putCustomEmailsByIdApi,
  putCustomTelephonesByIdApi,
  putIndividualAddressesByIdApi,
  putIndividualEmailsByIdApi,
  putIndividualTelephonesByIdApi,
  putMerchantAddressesByIdApi,
  putMerchantEmailsByIdApi,
  putMerchantTelephonesByIdApi,
  putRefundPointAddressesByIdApi,
  putRefundPointEmailsByIdApi,
  putRefundPointTelephonesByIdApi,
  putTaxFreeAddressesByIdApi,
  putTaxFreeEmailsByIdApi,
  putTaxFreeTelephonesByIdApi,
  putTaxOfficeAddressesByIdApi,
  putTaxOfficeEmailsByIdApi,
  putTaxOfficeTelephonesByIdApi,
} from "@repo/actions/unirefund/CrmService/put-actions";
import type {
  UniRefund_CRMService_Addresses_AddressUpSertDto as AddressUpSertDto,
  UniRefund_CRMService_Telephones_TelephoneUpsertDto as TelephoneUpsertDto,
  UniRefund_CRMService_Emails_EmailUpSertDto as EmailUpSertDto,
} from "@repo/saas/CRMService";
import {handlePutResponse} from "@repo/utils/api";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {PartyType} from "../party-header";

export function addressActionByPartyType({
  partyId,
  partyType,
  requestBody,
  router,
}: {
  partyId: string;
  partyType: PartyType;
  requestBody: AddressUpSertDto;
  router: AppRouterInstance;
}) {
  console.log("Updating/Creating party's address with; ", partyId, requestBody);
  switch (partyType) {
    case "merchants":
      void putMerchantAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "refund-points":
      void putRefundPointAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-free":
      void putTaxFreeAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-offices":
      void putTaxOfficeAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "customs":
      void putCustomAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "individuals":
      void putIndividualAddressesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    default:
      toast.error("Unknown party type");
      break;
  }
}

export function telephoneActionByPartyType({
  partyId,
  partyType,
  requestBody,
  router,
}: {
  partyId: string;
  partyType: PartyType;
  requestBody: TelephoneUpsertDto;
  router: AppRouterInstance;
}) {
  console.log("Updating/Creating party's telephones with; ", partyId, requestBody);
  switch (partyType) {
    case "merchants":
      void putMerchantTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "refund-points":
      void putRefundPointTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-free":
      void putTaxFreeTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-offices":
      void putTaxOfficeTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "customs":
      void putCustomTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "individuals":
      void putIndividualTelephonesByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    default:
      toast.error("Unknown party type");
      break;
  }
}

export function emailActionByPartyType({
  partyId,
  partyType,
  requestBody,
  router,
}: {
  partyId: string;
  partyType: PartyType;
  requestBody: EmailUpSertDto;
  router: AppRouterInstance;
}) {
  console.log("Updating/Creating party's email with; ", partyId, requestBody);
  switch (partyType) {
    case "merchants":
      void putMerchantEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "refund-points":
      void putRefundPointEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-free":
      void putTaxFreeEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "tax-offices":
      void putTaxOfficeEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "customs":
      void putCustomEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    case "individuals":
      void putIndividualEmailsByIdApi({
        id: partyId,
        requestBody,
      }).then((response) => {
        handlePutResponse(response, router);
      });
      break;
    default:
      toast.error("Unknown party type");
      break;
  }
}
