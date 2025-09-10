"use client";

import {Button} from "@/components/ui/button";
import type {
  Volo_Abp_Identity_ClaimTypeDto,
  Volo_Abp_Identity_IdentityUserClaimDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityUserClaimDto} from "@ayasofyazilim/core-saas/IdentityService";
import {putUserClaimsByIdApi} from "@repo/actions/core/IdentityService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Claims({
  languageData,
  claimsData,
  userClaimsData: initialUserClaimsData,
}: {
  languageData: IdentityServiceResource;
  claimsData: Volo_Abp_Identity_ClaimTypeDto[];
  userClaimsData: Volo_Abp_Identity_IdentityUserClaimDto[];
}) {
  const $schema = {
    type: "object",
    properties: {
      claims: {
        type: "array",
        items: $Volo_Abp_Identity_IdentityUserClaimDto,
        nullable: true,
      },
    },
  };
  const {userId} = useParams<{userId: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $schema,
    resources: languageData,
    name: "Form.User.Claim",
    extend: {
      claims: {
        items: {
          claimType: {
            "ui:widget": "UserClaimsWidget",
          },
        },
      },
    },
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "exclude",
        keys: ["claims.userId"],
      }}
      formData={{
        claims: initialUserClaimsData,
      }}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          const requestBody = formData.claims
            .map((claim) => {
              return {
                userId,
                ...claim,
              };
            })
            .filter((x) => x.claimType);
          void putUserClaimsByIdApi({
            id: userId,
            requestBody,
          }).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$schema}
      uiSchema={uiSchema}
      useDefaultSubmit={false}
      useTableForArrayItems
      widgets={{
        UserClaimsWidget: CustomComboboxWidget<Volo_Abp_Identity_ClaimTypeDto>({
          languageData,
          list: claimsData,
          selectIdentifier: "name",
          selectLabel: "name",
        }),
      }}>
      <Button data-testid="save">{languageData["Edit.Save"]}</Button>
    </SchemaForm>
  );
}
