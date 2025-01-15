"use client";
import type {
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
import { postAffiliationsToPartyApi } from "src/actions/unirefund/CrmService/post-actions";
import type {
  AffiliationsPostDto,
  PartyNameType,
} from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
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
  affiliationCodes: UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto[];
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
              list={affiliationCodes}
              selectIdentifier="id"
              selectLabel="name"
            />
          );
        },
      },
    },
  };
  function handleSubmit(formData: AutoFormValues) {
    const email = formData.email.emailAddress;
    const requestBody: AffiliationsPostDto = {
      affiliationCodeId: formData.affilation.affiliationCodeId,
      email: email || "",
      entityInformationTypeCode: "INDIVIDUAL",
    };
    void postAffiliationsToPartyApi(partyName, {
      requestBody,
      id: partyId,
    }).then((res) => {
      handlePostResponse(res, router);
    });
  }
  const columns = tableData.individuals.columns(languageData, locale);
  const table = tableData.individuals.table(
    languageData,
    affiliationsSchema,
    handleSubmit,
    fieldConfig,
    router,
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
