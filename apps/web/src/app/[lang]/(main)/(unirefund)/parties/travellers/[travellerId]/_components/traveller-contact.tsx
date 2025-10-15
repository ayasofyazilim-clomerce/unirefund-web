import {
  getTravellerAddressesByTravellerIdApi,
  getTravellerEmailsByTravellerIdApi,
  getTravellerTelephonesByTravellerIdApi,
} from "@repo/actions/unirefund/TravellerService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {OctagonAlert} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import {EmailForm} from "./contact/email-form";
import {AddressForm} from "./contact/address-form";
import {PhoneForm} from "./contact/phone-form";

async function getApiRequests({travellerId}: {travellerId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([]);
    const optionalRequests = await Promise.allSettled([
      getTravellerTelephonesByTravellerIdApi(travellerId, session),
      getTravellerEmailsByTravellerIdApi(travellerId, session),
      getTravellerAddressesByTravellerIdApi(travellerId, session),
    ]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export async function TravellerContact({params}: {params: {lang: string; travellerId: string}}) {
  const {lang, travellerId} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests({travellerId});
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [phoneResponse, emailResponse, addressResponse] = apiRequests.optionalRequests;

  return (
    <div className="flex flex-col gap-2">
      <FormReadyComponent
        active={phoneResponse.status !== "fulfilled"}
        content={{
          icon: <OctagonAlert className="size-10 text-gray-400" />,
          title: languageData["Messages.PhonesError.Title"],
          message: languageData["Messages.PhonesError.Message"],
        }}
        variant="compact">
        <PhoneForm
          languageData={languageData}
          phones={phoneResponse.status === "fulfilled" ? phoneResponse.value.data : []}
        />
      </FormReadyComponent>
      <FormReadyComponent
        active={emailResponse.status !== "fulfilled"}
        content={{
          icon: <OctagonAlert className="size-10 text-gray-400" />,
          title: languageData["Messages.EmailsError.Title"],
          message: languageData["Messages.EmailsError.Message"],
        }}
        variant="compact">
        <EmailForm
          emails={emailResponse.status === "fulfilled" ? emailResponse.value.data : []}
          languageData={languageData}
        />
      </FormReadyComponent>
      <FormReadyComponent
        active={emailResponse.status !== "fulfilled"}
        content={{
          icon: <OctagonAlert className="size-10 text-gray-400" />,
          title: languageData["Messages.EmailsError.Title"],
          message: languageData["Messages.EmailsError.Message"],
        }}
        variant="compact">
        <AddressForm
          addresses={addressResponse.status === "fulfilled" ? addressResponse.value.data : []}
          languageData={languageData}
        />
      </FormReadyComponent>
    </div>
  );
}
