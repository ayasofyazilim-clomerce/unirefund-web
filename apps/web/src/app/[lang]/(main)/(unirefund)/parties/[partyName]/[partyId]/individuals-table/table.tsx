"use client";
import { toast } from "@/components/ui/sonner";
import type {
  PagedResultDto_AffiliationCodeDto,
  PagedResultDto_AffiliationTypeDetailDto,
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto,
  UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import {
  $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
  $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import type { AutoFormInputComponentProps } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { CustomCombobox } from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { getIndividualsApi } from "src/actions/unirefund/CrmService/actions";
import { postAffiliationsToPartyApi } from "src/actions/unirefund/CrmService/post-actions";
import type { AffiliationsPostDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { PartyNameType } from "../../../types";
import { tableData } from "./individuals-table-data";

export interface AutoFormValues {
  email: UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;
  affilation: AffiliationsPostDto;
}

function Individual({
  locale,
  languageData,
  partyName,
  partyId,
  response,
  affiliationCodes,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
  locale: string;
  response: PagedResultDto_AffiliationTypeDetailDto;
  affiliationCodes: PagedResultDto_AffiliationCodeDto;
}) {
  const router = useRouter();
  const affiliationsSchema = createZodObject(
    {
      type: "object",
      properties: {
        email: $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
        affilation:
          $UniRefund_CRMService_AffiliationTypes_CreateAffiliationTypeDto,
      },
    },
    undefined,
    undefined,
    {
      email: ["emailAddress"],
      affilation: ["affiliationCodeId"],
    },
  );
  const fieldConfig = {
    affilation: {
      affiliationCodeId: {
        displayName: languageData.Role,
        renderer: (props: AutoFormInputComponentProps) => {
          "use client";
          return (
            <CustomCombobox<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>
              childrenProps={props}
              list={affiliationCodes.items}
              selectIdentifier="id"
              selectLabel="name"
            />
          );
        },
      },
    },
  };
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
        partyId: individualId || "",
        entityInformationTypeCode: "INDIVIDUAL",
      };
      void postAffiliationsToPartyApi(partyName, {
        requestBody,
        id: partyId,
      }).then((res) => {
        handlePostResponse(res, router);
      });
      return;
    }

    toast.error(languageData.NoIndividualFound);
  }
  const columns = tableData.individuals.columns(languageData, locale);
  const table = tableData.individuals.table(
    languageData,
    affiliationsSchema,
    handleSubmit,
    fieldConfig,
  );

  return (
    <SectionLayoutContent sectionId="individuals">
      <TanstackTable
        {...table}
        columns={columns}
        data={response.items || []}
        rowCount={response.totalCount}
      />
    </SectionLayoutContent>
  );
}

export default Individual;
