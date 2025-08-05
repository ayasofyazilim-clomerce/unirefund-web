"use server";

import {
  getRefundPointAddressesByRefundPointIdApi,
  getRefundPointByIdApi,
  getRefundPointEmailsByRefundPointIdApi,
  getRefundPointTelephonesByRefundPointIdApi,
  getTaxOfficesApi,
} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {RefundPointForm} from "./_components/info-form";
import {PhoneForm} from "../../../_components/contact/phone-form";
import {EmailForm} from "../../../_components/contact/email-form";
import {AddressForm} from "../../../_components/contact/address-form";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {OctagonAlert} from "lucide-react";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRefundPointByIdApi(partyId, session),
      getTaxOfficesApi({}, session),
    ]);
    const optionalRequests = await Promise.allSettled([
      getRefundPointTelephonesByRefundPointIdApi(partyId, session),
      getRefundPointEmailsByRefundPointIdApi(partyId, session),
      getRefundPointAddressesByRefundPointIdApi(partyId, session),
    ]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({partyId});

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [refundPointDetailResponse, taxOfficeResponse] = apiRequests.requiredRequests;
  const [phoneResponse, emailResponse, addressResponse] = apiRequests.optionalRequests;

  return (
    <div className="grid h-full gap-4 overflow-auto md:grid-cols-2">
      <RefundPointForm
        languageData={languageData}
        refundPointDetails={refundPointDetailResponse.data}
        taxOffices={taxOfficeResponse.data.items || []}
      />
      <div className="grid gap-4 self-start">
        <FormReadyComponent
          variant="compact"
          active={phoneResponse?.status !== "fulfilled"}
          content={{
            icon: <OctagonAlert className="size-10 text-gray-400" />,
            title: languageData["CRM.Messages.PhonesError.Title"],
            message: languageData["CRM.Messages.PhonesError.Message"],
          }}>
          <PhoneForm
            languageData={languageData}
            phones={phoneResponse?.status === "fulfilled" ? phoneResponse.value.data : []}
          />
        </FormReadyComponent>
        <FormReadyComponent
          variant="compact"
          active={emailResponse?.status !== "fulfilled"}
          content={{
            icon: <OctagonAlert className="size-10 text-gray-400" />,
            title: languageData["CRM.Messages.EmailsError.Title"],
            message: languageData["CRM.Messages.EmailsError.Message"],
          }}>
          <EmailForm
            languageData={languageData}
            emails={emailResponse?.status === "fulfilled" ? emailResponse.value.data : []}
          />
        </FormReadyComponent>
        <FormReadyComponent
          variant="compact"
          active={addressResponse?.status !== "fulfilled"}
          content={{
            icon: <OctagonAlert className="size-10 text-gray-400" />,
            title: languageData["CRM.Messages.AddressesError.Title"],
            message: languageData["CRM.Messages.AddressesError.Message"],
          }}>
          <AddressForm
            languageData={languageData}
            addresses={addressResponse?.status === "fulfilled" ? addressResponse.value.data : []}
          />
        </FormReadyComponent>
      </div>
    </div>
  );
}
