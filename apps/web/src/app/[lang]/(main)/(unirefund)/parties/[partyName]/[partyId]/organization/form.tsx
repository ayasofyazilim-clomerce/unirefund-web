"use client";

import type { UniRefund_CRMService_Organizations_OrganizationDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { putCrmOrganizationApi } from "src/actions/unirefund/CrmService/put-actions";
import type { OrganizationUpdateDto } from "src/actions/unirefund/CrmService/types";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { PartyNameType } from "../../../types";
import { editSchemasOfParties } from "../update-data";

function OrganizationForm({
  languageData,
  partyName,
  partyId,
  organizationId,
  organizationData,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
  organizationId: string;
  organizationData: UniRefund_CRMService_Organizations_OrganizationDto;
}) {
  const router = useRouter();
  const { organizationSchema, organizationSchemaSubPositions } =
    editSchemasOfParties[partyName];

  //hide branchId & parent because its headquarter
  const _organizationSchema = createZodObject(
    organizationSchema,
    organizationSchemaSubPositions,
  );

  function handleSubmit(formData: OrganizationUpdateDto) {
    void putCrmOrganizationApi(partyName, {
      requestBody: formData,
      id: partyId,
      organizationId: organizationId || "",
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  return (
    <SectionLayoutContent sectionId="organization">
      <AutoForm
        formClassName="pb-40"
        formSchema={_organizationSchema}
        onSubmit={(values) => {
          handleSubmit(values as OrganizationUpdateDto);
        }}
        values={organizationData}
      >
        <AutoFormSubmit className="float-right">
          {languageData.Save}
        </AutoFormSubmit>
      </AutoForm>
    </SectionLayoutContent>
  );
}

export default OrganizationForm;
