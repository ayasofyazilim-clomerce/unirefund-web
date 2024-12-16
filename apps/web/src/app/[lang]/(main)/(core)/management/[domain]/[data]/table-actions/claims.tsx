"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import type {
  Volo_Abp_Identity_ClaimTypeDto,
  Volo_Abp_Identity_IdentityRoleClaimDto,
  Volo_Abp_Identity_IdentityUserClaimDto,
} from "@ayasofyazilim/saas/IdentityService";
import {
  $Volo_Abp_Identity_IdentityRoleClaimDto,
  $Volo_Abp_Identity_IdentityUserClaimDto,
} from "@ayasofyazilim/saas/IdentityService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getClaimsApi,
  getRoleClaimsApi,
  getUserClaimsApi,
  putRoleClaimsApi,
  putUserClaimsApi,
} from "src/actions/core/IdentityService/actions";
import { getResourceDataClient } from "src/language-data/core/IdentityService";

type ClaimsProps =
  | Volo_Abp_Identity_IdentityRoleClaimDto
  | Volo_Abp_Identity_IdentityUserClaimDto;

export default function Claims({
  rowId,
  setIsOpen,
  params,
}: {
  rowId: string;
  params: {
    lang: string;
    data: string;
  };
  setIsOpen?: (e: boolean) => void;
}) {
  const languageData = getResourceDataClient(params.lang);
  const [claims, setClaims] = useState<Volo_Abp_Identity_ClaimTypeDto[]>([]);
  const [claimList, setClaimList] = useState<ClaimsProps[]>([]);

  function getFormSchema() {
    const schema =
      params.data === "role"
        ? $Volo_Abp_Identity_IdentityRoleClaimDto
        : $Volo_Abp_Identity_IdentityUserClaimDto;
    return createZodObject(schema, ["claimType", "claimValue"]);
  }

  const translatedForm = createFieldConfigWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleClaimDto,
    resources: languageData,
    extend: {
      claimType: {
        renderer: (props) => (
          <CustomCombobox<Volo_Abp_Identity_ClaimTypeDto>
            childrenProps={props}
            emptyValue={languageData["Claim.Select"]}
            list={claims}
            selectIdentifier="name"
            selectLabel="name"
          />
        ),
      },
    },
  });

  const getClaims = async () => {
    const response = await getClaimsApi();
    if (response.type === "success") {
      setClaims(response.data.items || []);
    } else {
      toast.error(response.message);
    }
  };

  const putClaims = async () => {
    let response;
    if (params.data === "role") {
      response = await putRoleClaimsApi({
        id: rowId,
        requestBody: claimList,
      });
    } else if (params.data === "user") {
      response = await putUserClaimsApi({
        id: rowId,
        requestBody: claimList,
      });
    }
    if (response && response.type === "success") {
      toast.success(languageData["Claim.New.Succes"]);
      setIsOpen && setIsOpen(false);
    } else {
      toast.error(response?.message || languageData["Claim.New.Fail"]);
    }
  };

  const getRoleUserClaims = async (id = rowId) => {
    let response;
    if (params.data === "role") {
      response = await getRoleClaimsApi({ id });
    } else if (params.data === "user") {
      response = await getUserClaimsApi({ id });
    }
    if (response && response.type === "success") {
      setClaimList(response.data);
    } else {
      toast.error(response?.message);
    }
  };

  const handleAddClaim = (newClaim: ClaimsProps) => {
    if (!newClaim.claimType || !newClaim.claimValue) {
      toast.error(languageData["Claim.Empty.Fields"]);
      return;
    }
    const exists = claimList.some(
      (claim) =>
        claim.claimType === newClaim.claimType &&
        claim.claimValue === newClaim.claimValue,
    );
    if (exists) {
      toast.error(languageData["Claim.Exist.Fail"]);
    } else {
      setClaimList((prevList) => [...prevList, newClaim]);
    }
  };

  const handleRemoveClaim = (index: number) => {
    setClaimList((prevList) => prevList.filter((_, i) => i !== index));
  };

  useEffect(() => {
    void getClaims();
    void getRoleUserClaims();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <AutoForm
          fieldConfig={translatedForm}
          formSchema={getFormSchema()}
          onSubmit={handleAddClaim}
        >
          <Button className="mb-4 w-full">{languageData["Claim.Add"]}</Button>
        </AutoForm>
      </div>
      <div>
        <div>
          {claimList.map((claim, index) => (
            <div className="mb-2 flex items-center" key={index}>
              <span className=" w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                {claim.claimType}
              </span>
              <Input
                className="flex-grow "
                onChange={(e) => {
                  setClaimList((prevList) => {
                    const updatedList = [...prevList];
                    updatedList[index].claimValue = e.target.value;
                    return updatedList;
                  });
                }}
                value={claim.claimValue || ""}
              />
              <Button
                className="ml-2 bg-red-100 hover:bg-red-200  "
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
          <Button className="ml-4" onClick={() => void putClaims()}>
            {languageData["Edit.Save"]}
          </Button>
        </div>
      </div>
    </div>
  );
}
