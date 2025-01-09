"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import type {
  Volo_Abp_Identity_ClaimTypeDto,
  Volo_Abp_Identity_IdentityUserClaimDto,
} from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityUserClaimDto } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putUserClaimsByIdApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function Claims({
  languageData,
  claimsData,
  userClaimsData: initialUserClaimsData,
}: {
  languageData: IdentityServiceResource;
  claimsData: Volo_Abp_Identity_ClaimTypeDto[];
  userClaimsData: Volo_Abp_Identity_IdentityUserClaimDto[];
}) {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userClaimsData, setUserClaimsData] = useState(initialUserClaimsData);
  const [newClaim, setNewClaim] =
    useState<Volo_Abp_Identity_IdentityUserClaimDto>({
      claimType: "",
      claimValue: "",
    });

  const handleAddClaim = () => {
    if (!newClaim.claimType || !newClaim.claimValue) {
      toast.error(languageData["User.Claim.Empty.Fields"]);
      return;
    }
    const exists = userClaimsData.some(
      (claim) =>
        claim.claimType === newClaim.claimType &&
        claim.claimValue === newClaim.claimValue,
    );
    if (exists) {
      toast.error(languageData["User.Claim.Exist.Fail"]);
    } else {
      setUserClaimsData((prevList) => [...prevList, newClaim]);
      setNewClaim({ claimType: "", claimValue: "" });
    }
  };

  const handleRemoveClaim = (index: number) => {
    setUserClaimsData((prevList) => prevList.filter((_, i) => i !== index));
  };

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityUserClaimDto,
    resources: languageData,
    name: "Form.User.Claim",
    extend: {
      claimType: {
        "ui:widget": "UserClaimsWidget",
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
          schema={$Volo_Abp_Identity_IdentityUserClaimDto}
          uiSchema={uiSchema}
          useDefaultSubmit={false}
          widgets={{
            UserClaimsWidget:
              CustomComboboxWidget<Volo_Abp_Identity_ClaimTypeDto>({
                languageData,
                list: claimsData,
                selectIdentifier: "name",
                selectLabel: "name",
              }),
          }}
        >
          <Button
            className="mb-4"
            onClick={(e) => {
              e.preventDefault();
              handleAddClaim();
            }}
          >
            {languageData["User.Claim.Add"]}
          </Button>
        </SchemaForm>
      </div>
      <div>
        {userClaimsData.map((claim, index) => (
          <div className="mb-2 flex items-center" key={index}>
            <span className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {claim.claimType}
            </span>
            <Input
              className="flex-grow"
              onChange={(e) => {
                setUserClaimsData((prevList) => {
                  const updatedList = [...prevList];
                  updatedList[index].claimValue = e.target.value;
                  return updatedList;
                });
              }}
              value={claim.claimValue || ""}
            />
            <Button
              className="ml-2 bg-red-100 hover:bg-red-200"
              onClick={() => {
                handleRemoveClaim(index);
              }}
              variant="ghost"
            >
              <Trash2 className="h-4 w-4 stroke-red-500" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          className="ml-4"
          disabled={loading}
          onClick={() =>
            void putUserClaimsByIdApi({
              id: userId,
              requestBody: userClaimsData,
            })
              .then((res) => {
                handlePutResponse(res, router);
              })
              .finally(() => {
                setLoading(false);
              })
          }
        >
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}
