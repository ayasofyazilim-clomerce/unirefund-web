"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/sonner";
import type {
  Volo_Abp_Identity_ClaimTypeDto,
  Volo_Abp_Identity_IdentityRoleClaimDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityRoleClaimDto} from "@ayasofyazilim/core-saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {Trash2} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putRoleClaimsByIdApi} from "@repo/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Claims({
  languageData,
  claimsData,
  roleClaimsData: initialRoleClaimsData,
}: {
  languageData: IdentityServiceResource;
  claimsData: Volo_Abp_Identity_ClaimTypeDto[];
  roleClaimsData: Volo_Abp_Identity_IdentityRoleClaimDto[];
}) {
  const {roleId} = useParams<{roleId: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [roleClaimsData, setRoleClaimsData] = useState(initialRoleClaimsData);
  const [newClaim, setNewClaim] = useState<Volo_Abp_Identity_IdentityRoleClaimDto>({
    claimType: "",
    claimValue: "",
  });

  const handleAddClaim = () => {
    if (!newClaim.claimType || !newClaim.claimValue) {
      toast.error(languageData["Role.Claim.Empty.Fields"]);
      return;
    }
    const exists = roleClaimsData.some(
      (claim) => claim.claimType === newClaim.claimType && claim.claimValue === newClaim.claimValue,
    );
    if (exists) {
      toast.error(languageData["Role.Claim.Exist.Fail"]);
    } else {
      setRoleClaimsData((prevList) => [...prevList, newClaim]);
      setNewClaim({claimType: "", claimValue: ""});
    }
  };

  const handleRemoveClaim = (index: number) => {
    setRoleClaimsData((prevList) => prevList.filter((_, i) => i !== index));
  };

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleClaimDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      claimType: {
        "ui:widget": "RoleClaimsWidget",
      },
    },
  });

  return (
    <div className="mb-4 flex flex-col overflow-y-auto p-4">
      <div className="mb-4 flex flex-col ">
        <SchemaForm
          className="flex flex-col gap-4"
          filter={{
            type: "include",
            sort: true,
            keys: ["claimType", "claimValue"],
          }}
          formData={newClaim}
          onChange={(data) => {
            if (data.formData) {
              setNewClaim(data.formData);
            }
          }}
          schema={$Volo_Abp_Identity_IdentityRoleClaimDto}
          uiSchema={uiSchema}
          useDefaultSubmit={false}
          widgets={{
            RoleClaimsWidget: CustomComboboxWidget<Volo_Abp_Identity_ClaimTypeDto>({
              languageData,
              list: claimsData,
              selectIdentifier: "name",
              selectLabel: "name",
            }),
          }}>
          <Button
            className="mb-4"
            data-testid="Role.Claim.Add"
            onClick={(e) => {
              e.preventDefault();
              handleAddClaim();
            }}>
            {languageData["Role.Claim.Add"]}
          </Button>
        </SchemaForm>
      </div>
      <div>
        {roleClaimsData.map((claim, index) => (
          <div className="mb-2 flex items-center" key={index}>
            <span className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">{claim.claimType}</span>
            <Input
              className="flex-grow"
              data-testid="Role.Claim.Value"
              onChange={(e) => {
                setRoleClaimsData((prevList) => {
                  const updatedList = [...prevList];
                  updatedList[index].claimValue = e.target.value;
                  return updatedList;
                });
              }}
              value={claim.claimValue || ""}
            />
            <Button
              className="ml-2 bg-red-100 hover:bg-red-200"
              data-testid="Role.Claim.Remove"
              onClick={() => {
                handleRemoveClaim(index);
              }}
              variant="ghost">
              <Trash2 className="h-4 w-4 stroke-red-500" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          className="ml-4"
          data-testid="Role.Claim.Save"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              void putRoleClaimsByIdApi({
                id: roleId,
                requestBody: roleClaimsData,
              }).then((res) => {
                handlePutResponse(res, router, "..");
              });
            });
          }}>
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}
