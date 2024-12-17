"use client";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
  UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto,
} from "@ayasofyazilim/saas/IdentityService";
import { $UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto } from "@ayasofyazilim/saas/IdentityService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import { MultiSelect } from "@repo/ayasofyazilim-ui/molecules/multi-select";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useEffect, useState } from "react";
import { getAssignableRolesApi } from "src/actions/core/IdentityService/actions";
import { putAssignableRolesApi } from "src/actions/core/IdentityService/put-actions";
import { getResourceDataClient } from "src/language-data/core/IdentityService";

const assignableRoleSchema = createZodObject(
  $UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto,
  ["targetRoleIds"],
);
export default function AssignableRoles({
  rowId,
  lang,
  setIsOpen,
}: {
  rowId: string;
  lang: string;
  setIsOpen?: (e: boolean) => void;
}) {
  const languageData = getResourceDataClient(lang);

  const [assignableRoles, setAssignableRoles] = useState<
    UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[]
  >([]);

  useEffect(() => {
    const fetchAssignableRoles = async () => {
      const response = await getAssignableRolesApi(rowId);
      if (response.type === "success") {
        setAssignableRoles(response.data);
      } else {
        toast.error(
          `${response.status}: ${
            response.message || languageData["Role.AssignableRoles.Get.Fail"]
          }`,
        );
      }
    };
    void fetchAssignableRoles();
  }, []);

  const putAssignableRoles = async (
    formData: UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto,
  ) => {
    const response = await putAssignableRolesApi({
      requestBody: {
        sourceRoleId: rowId,
        targetRoleIds: formData.targetRoleIds,
      },
    });
    if (response.type === "success") {
      toast.success(languageData["Role.AssignableRoles.Put.Success"]);
      setIsOpen && setIsOpen(false);
    } else {
      toast.error(
        `${response.status}: ${
          response.message || languageData["Role.AssignableRoles.Put.Fail"]
        }`,
      );
    }
  };

  return (
    <AutoForm
      fieldConfig={{
        targetRoleIds: {
          renderer: function RoleComboboxRenderer(props) {
            return (
              <div className="mb-1 w-full">
                <label className="text-bold mb-1 block text-sm">
                  {languageData["Role.Names"]}
                </label>
                <MultiSelect
                  defaultValue={assignableRoles
                    .filter((role) => role.isAssignable)
                    .map((role) => role.roleId)}
                  onValueChange={(e) => {
                    props.field.onChange(e);
                  }}
                  options={assignableRoles.map((role) => ({
                    label: role.roleName || "",
                    value: role.roleId || "",
                  }))}
                  placeholder={languageData["Role.Select"]}
                />
              </div>
            );
          },
        },
      }}
      formSchema={assignableRoleSchema}
      onSubmit={(data) => {
        void putAssignableRoles(
          data as UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto,
        );
      }}
    >
      <AutoFormSubmit className="float-right">
        {languageData["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}
