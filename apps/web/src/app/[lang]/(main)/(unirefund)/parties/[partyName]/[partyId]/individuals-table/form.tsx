"use client";

import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
  $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type { AutoFormInputComponentProps } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import AutoForm, {
  AutoFormSubmit,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAffiliationCodeApi,
  getIndividualsApi,
} from "src/actions/unirefund/CrmService/actions";
import { postAffiliationsApi } from "src/actions/unirefund/CrmService/post-actions";
import type { AffiliationsPostDto } from "src/actions/unirefund/CrmService/types";
import {
  handleGetResponseError,
  handlePostResponse,
} from "src/actions/core/api-utils-client";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { PartyNameType } from "../../../types";

interface AutoFormValues {
  email: UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
  affilation: AffiliationsPostDto;
}
function AffiliationsForm({
  languageData,
  partyName,
  partyId,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
}) {
  const [affiliationCodes, setAffiliationCodes] = useState<
    UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[]
  >([]);
  const router = useRouter();

  const affiliationsSchema = createZodObject(
    {
      type: "object",
      properties: {
        email: $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
        affilation:
          $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
      },
    },
    undefined,
    undefined,
    {
      email: ["emailAddress"],
      affilation: ["roleId"],
    },
  );

  useEffect(() => {
    void getAffiliationCodeApi("individuals").then((response) => {
      if (response.type === "success") {
        setAffiliationCodes(response.data.items || []);
        return;
      }
      handleGetResponseError(response);
    });
  }, []);

  async function handleSubmit(formData: AutoFormValues) {
    const email = formData.email.emailAddress;
    const doesEmailExistsResponse = await getIndividualsApi({
      email,
      maxResultCount: 1,
    });
    if (doesEmailExistsResponse.type !== "success") {
      toast.error(languageData["Fetch.Fail"]);
      return;
    }

    if (doesEmailExistsResponse.data.items?.length !== 0) {
      const individualId = doesEmailExistsResponse.data.items?.[0].id;
      const requestBody: AffiliationsPostDto = {
        affiliationCodeId: formData.affilation.affiliationCodeId,
        name: "",
        description: "",
        partyId: individualId,
      };
      void postAffiliationsApi(partyName, {
        requestBody,
        id: partyId,
      }).then((response) => {
        handlePostResponse(response, router);
      });
      return;
    }

    toast.error(languageData.NoIndividualFound);
  }

  const fieldConfig = {
    affilation: {
      roleId: {
        displayName: languageData.Role,
        renderer: (props: AutoFormInputComponentProps) => {
          "use client";
          return (
            <CustomCombobox<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>
              childrenProps={props}
              list={affiliationCodes}
              selectIdentifier="id"
              selectLabel="name"
            />
          );
        },
      },
    },
  };
  return (
    <AutoForm
      fieldConfig={fieldConfig}
      formClassName="pb-40"
      formSchema={affiliationsSchema}
      onSubmit={(values) => {
        void handleSubmit(values as AutoFormValues);
      }}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default AffiliationsForm;
