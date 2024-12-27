/* eslint-disable no-await-in-loop, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument -- TODO: we need to fix this*/
"use client";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
  Volo_Abp_Identity_OrganizationUnitDto,
} from "@ayasofyazilim/saas/IdentityService";
import {
  createZodObject,
  type SchemaType,
} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import jsonToCSV from "@repo/ayasofyazilim-ui/lib/json-to-csv";
import { MultiSelect } from "@repo/ayasofyazilim-ui/molecules/multi-select";
import type {
  ColumnsType,
  fetchRequestProps,
  TableAction,
} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import {
  createFieldConfigWithResource,
  mergeFieldConfigs,
  type AutoFormProps,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import type { FormModifier, TableData } from "@repo/ui/utils/table/table-utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  getAssignableRolesByCurrentUserApi,
  getUserOrganizationApi,
} from "src/actions/core/IdentityService/actions.ts";
import { getResourceDataClient } from "src/language-data/core/IdentityService/index.ts";
import { getBaseLink } from "src/utils.ts";
import { dataConfig } from "../../data.tsx";
import AssignableRoles from "./table-actions/assignable-roles.tsx";
import Claims from "./table-actions/claims.tsx";
import PermissionsComponent from "./table-actions/permissions.tsx";
import SessionsComponent from "./table-actions/sessions.tsx";

async function controlledFetch(
  url: string,
  options: RequestInit,
  onSuccess: (_data?: any) => void,
  successMessage = "Successful",
  showToast = true,
) {
  try {
    const getData = await fetch(url, options);
    if (!getData.ok) {
      const body = await getData.json();
      toast.error(body.message);
    } else {
      const data = await getData.json();
      onSuccess(data);
      showToast && toast.success(successMessage);
    }
  } catch (error) {
    toast.error(`Fetch error: ${String(error)}`);
  }
}

function convertEnumField(
  value: string | number,
  enumArray: {
    data: string[];
    type: "enum";
  },
): string | number {
  const data = enumArray.data;
  if (typeof value === "number") {
    return data[value];
  }
  return data.indexOf(value);
}

interface ConvertorValue {
  covertTo?: string;
  data: any;
  get: string;
  post: string;
  type: "enum" | "async";
}

function convertAsyncField(value: any, ConvertorValue: ConvertorValue) {
  if (typeof ConvertorValue.data === "function") {
    return;
  }
  const returnValue = ConvertorValue.data.find((item: any) => {
    return item[ConvertorValue.get] === value;
  });
  if (returnValue) {
    return returnValue[ConvertorValue.post];
  }
}

export default function PageClient(): JSX.Element {
  const { lang, data, domain } = useParams<{
    data: string;
    domain: string;
    lang: string;
  }>();
  const languageData = getResourceDataClient(lang);
  const fetchLink = getBaseLink(`/api/admin/${data}`);
  const [roles, setRoles] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<TableData>(
    dataConfig[domain].pages[data],
  );
  const [rolesData, setRolesData] = useState<
    UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[]
  >([]);
  const [organizationData, setOrganizationData] = useState<
    Volo_Abp_Identity_OrganizationUnitDto[]
  >([]);
  const [userOrganizationData, setUserOrganizationData] = useState<
    Volo_Abp_Identity_OrganizationUnitDto[]
  >([]);
  async function getRolesData() {
    const response = await getAssignableRolesByCurrentUserApi();
    if (response.type === "success") {
      setRolesData(response.data);
    }
  }

  async function getOrganizationData() {
    const url = getBaseLink(`/api/admin/organization`);
    const response = await fetch(url);
    if (response.ok) {
      const _data = await response.json();
      setOrganizationData(_data.items || []);
    }
  }
  async function getUserOrganizationData(id: string) {
    const response = await getUserOrganizationApi(id);
    if (response.type === "success") {
      setUserOrganizationData(response.data);
    }
  }

  const detailedFilters = dataConfig[domain].pages[data].detailedFilters || [];
  async function processConvertors() {
    const tempData = { ...formData };
    const schemas = ["createFormSchema", "editFormSchema"] as const;

    for (const schema of schemas) {
      const dataConvertors = tempData[schema]?.convertors;
      if (dataConvertors) {
        for (const [key, value] of Object.entries(dataConvertors)) {
          if (value.type === "async" && typeof value.data === "function") {
            try {
              const tempValue = await value.data();
              if (dataConvertors[key]) {
                dataConvertors[key].data = tempValue;
                dataConvertors[key].type = "async";
              }
            } catch (error) {
              toast.error(`Feild to fetch ${`${key} ${value}`} data`);
            }
          }
        }
      }
    }
    setFormData(tempData);
  }

  function getRoles({ page: _page, filter: _filter }: fetchRequestProps) {
    let page = _page;
    const filter = JSON.stringify(_filter) || "";
    if (typeof page !== "number") {
      page = 0;
    }

    const _fetchLink = `${fetchLink}?page=${page}&filter=${filter}`;
    setIsLoading(true);
    function onData(responseData: any) {
      let returnData = responseData;
      if (!responseData?.items) {
        returnData = {
          totalCount: responseData.length,
          items: responseData,
        };
      }
      const dataConvertors = formData.tableSchema.convertors;
      let transformedData = returnData.items;
      if (dataConvertors) {
        transformedData = returnData.items.map((item: any) => {
          const returnObject = { ...item };
          Object.entries(dataConvertors).forEach(([key, value]) => {
            if (value.type === "enum") {
              returnObject[key] = convertEnumField(returnObject[key], value);
            }
            if (value.type === "async") {
              returnObject[key] = returnObject[value.covertTo];
            }
          });
          return returnObject;
        });
      }
      setRoles({ ...returnData, items: transformedData });
      setIsLoading(false);
    }
    void controlledFetch(
      _fetchLink,
      {
        method: "GET",
      } as RequestInit,
      onData,
      "",
      false,
    );
  }
  const translatedForm = createFieldConfigWithResource({
    schema: formData.createFormSchema?.schema as SchemaType,
    resources: languageData,
  });
  const createFormSchema = formData.createFormSchema;
  let action: TableAction[] | undefined;
  if (createFormSchema) {
    action = [
      {
        cta: languageData[
          `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
        ],
        componentType: "Autoform",
        description:
          languageData[
            `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
          ],
        autoFormArgs: {
          formSchema: createZodObject(
            createFormSchema.schema,
            createFormSchema.formPositions || [],
            createFormSchema.convertors || {},
          ),
          dependencies: createFormSchema.dependencies,
          fieldConfig: mergeFieldConfigs(translatedForm, {
            all: {
              withoutBorder: true,
            },
            roleNames: {
              renderer(props) {
                return (
                  <div className="mb-1">
                    <label className="text-bold mb-0.5 block text-sm">
                      {languageData["Role.Names"]}
                    </label>
                    <MultiSelect
                      onValueChange={(e) => {
                        props.field.onChange(e);
                      }}
                      options={rolesData
                        .filter((role) => role.isAssignable)
                        .map((role) => ({
                          label: role.roleName,
                          value: role.roleName,
                        }))}
                      placeholder={languageData["Role.Select"]}
                    />
                  </div>
                );
              },
            },
            organizationUnitIds: {
              renderer(props) {
                return (
                  <div className="mb-1">
                    <label className="text-bold mb-0.5 block text-sm ">
                      {languageData["Organization.Names"]}
                    </label>
                    <MultiSelect
                      onValueChange={(e) => {
                        props.field.onChange(e);
                      }}
                      options={organizationData.map((organization) => ({
                        label: organization.displayName || "",
                        value: organization.id || "",
                      }))}
                      placeholder={languageData["Organization.select"]}
                    />
                  </div>
                );
              },
            },
          }),
          submit: {
            cta: languageData.Save,
          },
        },
        callback: (e) => {
          const transformedData = parseFormValues(createFormSchema, e);
          void controlledFetch(
            fetchLink,
            {
              method: "POST",
              body: JSON.stringify(transformedData),
            },
            getRoles,
            "Added Successfully",
          );
        },
        type: "Dialog",
      },
      {
        cta: `Export CSV`,
        callback: () => {
          jsonToCSV(roles, data);
        },
        type: "Action",
      },
    ];
  }

  useEffect(() => {
    void processConvertors();
    void getRolesData();
    void getOrganizationData();
    void getUserOrganizationData("");
  }, []);

  function parseFormValues(schema: FormModifier, _formData: any) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {},
    );
    if (!schema.convertors) return newSchema.parse(_formData);
    const transformedSchema = newSchema.transform((val) => {
      const returnObject = { ...val };
      if (!schema.convertors) return returnObject;
      Object.entries(schema.convertors).forEach(([key, value]) => {
        if (value.type === "enum") {
          returnObject[key] = convertEnumField(returnObject[key], value);
        } else if (value.type === "async") {
          returnObject[key] = convertAsyncField(returnObject[key], value);
        }
      });
      return returnObject;
    });
    const parsed = transformedSchema.parse(_formData);
    return parsed;
  }

  const onEdit = (editData: any, row: any, editFormSchema: any) => {
    const parsedData = parseFormValues(editFormSchema, editData);
    void controlledFetch(
      fetchLink,
      {
        method: "PUT",
        body: JSON.stringify({
          id: row.id,
          requestBody: JSON.stringify(parsedData),
        }),
      },
      getRoles,
      "Updated Successfully",
    );
  };

  const onDelete = (row: any) => {
    void controlledFetch(
      fetchLink,
      {
        method: "DELETE",
        body: JSON.stringify(row.id),
      },
      getRoles,
      "Deleted Successfully",
    );
  };

  function convertZod(schema: FormModifier) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
      schema.convertors || {},
    );
    return newSchema;
  }
  const editFormSchema = formData.editFormSchema;
  let editFormSchemaZod,
    autoformEditArgs: AutoFormProps = {
      formSchema: z.object({}),
    };
  if (editFormSchema) {
    editFormSchemaZod = convertZod(editFormSchema);
    autoformEditArgs = {
      formSchema: editFormSchemaZod,
      dependencies: formData.editFormSchema?.dependencies,
      // convertor: formData.tableSchema.convertors,
      fieldConfig: mergeFieldConfigs(translatedForm, {
        all: {
          withoutBorder: true,
        },
        roleNames: {
          renderer(props) {
            const isAssignable = rolesData.filter((role) => role.isAssignable);
            return (
              <div className="mb-1">
                <label className="text-bold mb-0.5 block text-sm">
                  {languageData["Role.Names"]}
                </label>
                <MultiSelect
                  defaultValue={props.field.value}
                  onValueChange={(e) => {
                    props.field.onChange(e);
                  }}
                  options={isAssignable.map((role) => ({
                    label: role.roleName,
                    value: role.roleName,
                  }))}
                  placeholder={languageData["Role.Select"]}
                />
              </div>
            );
          },
        },
        organizationUnitIds: {
          renderer(props) {
            return (
              <div className="mb-1">
                <label className="text-bold mb-0.5 block text-sm ">
                  {languageData["Organization.Names"]}
                </label>
                <MultiSelect
                  defaultValue={userOrganizationData.map(
                    (organization) => organization.id || "",
                  )}
                  onValueChange={(e) => {
                    props.field.onChange(e);
                  }}
                  options={organizationData.map((organization) => ({
                    label: organization.displayName || "",
                    value: organization.id || "",
                  }))}
                  placeholder={languageData["Organization.select"]}
                />
              </div>
            );
          },
        },
      }),
    };
  }
  let actionList: TableAction[] = [];
  if (formData.tableSchema.actionList) {
    actionList = formData.tableSchema.actionList(controlledFetch, getRoles);
  }
  const columnsData: ColumnsType = {
    type: "Auto",
    data: {
      tableType: formData.tableSchema.schema,
      excludeList: formData.tableSchema.excludeList || [],
      actionList,
    },
  };

  columnsData.data.actionList?.push({
    cta: languageData.Delete,
    type: "Dialog",
    componentType: "ConfirmationDialog",
    description: `${languageData["Delete.Assurance"]} ${formData.title}?`,
    cancelCTA: languageData.Cancel,
    variant: "destructive",
    callback: (rowData) => {
      onDelete(rowData);
    },
  });
  columnsData.data.actionList?.push({
    cta: languageData.Edit,
    description: languageData.Edit,
    type: "Dialog",
    componentType: "Autoform",
    autoFormArgs: {
      ...autoformEditArgs,
      submit: {
        cta: languageData["Edit.Save"],
      },
    },
    callback: (formValues, row) => {
      onEdit(formValues, row, editFormSchema);
    },
  });

  const claimComponent = async (
    row: { id: string },
    setIsOpen?: (e: boolean) => void,
  ) => {
    await Promise.resolve();
    return (
      <Claims
        params={{
          lang,
          data,
        }}
        rowId={row.id}
        setIsOpen={setIsOpen}
      />
    );
  };

  if (data === "role") {
    columnsData.data.actionList?.push({
      type: "Dialog",
      cta: languageData.Claims,
      loadingContent: <>Loading...</>,
      description: languageData["Claim.Add.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (setIsOpen) => claimComponent(setIsOpen),
      content: <></>,
    });
  }
  if (data === "user") {
    columnsData.data.actionList?.push({
      type: "Dialog",
      cta: languageData.Claims,
      loadingContent: <>Loading...</>,
      description: languageData["Claim.Add.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (setIsOpen) => claimComponent(setIsOpen),
      content: <></>,
    });
  }
  const session = async (row: { id: string }) => {
    await Promise.resolve();
    return <SessionsComponent lang={lang} rowId={row.id} />;
  };
  if (data === "user") {
    columnsData.data.actionList?.push({
      type: "Sheet",
      cta: languageData["User.Sessions"],
      loadingContent: <>Loading...</>,
      description: languageData["User.Sessions.Description"],
      componentType: "CustomComponent",
      customComponentRendering: session,
      content: <></>,
    });
  }
  const permissions = async (
    row: { id: string },
    roleName: string,
    setIsOpen?: (e: boolean) => void,
  ) => {
    await Promise.resolve();
    return (
      <PermissionsComponent
        params={{
          lang,
          data,
        }}
        roleName={roleName}
        rowId={row.id}
        setIsOpen={setIsOpen}
      />
    );
  };

  if (data === "user" || data === "role") {
    columnsData.data.actionList?.push({
      type: "Sheet",
      cta: languageData.Permissions,
      loadingContent: <>Loading...</>,
      description: languageData["Permissions.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (row, setIsOpen) =>
        permissions(row, row.name as string, setIsOpen),
      content: <></>,
    });
  }
  const assingableRoles = async (
    row: { id: string },
    setIsOpen?: (e: boolean) => void,
  ) => {
    await Promise.resolve();
    return <AssignableRoles lang={lang} rowId={row.id} setIsOpen={setIsOpen} />;
  };
  if (data === "role") {
    columnsData.data.actionList?.push({
      type: "Dialog",
      cta: languageData["Role.Assignable"],
      loadingContent: <>Loading...</>,
      description: languageData["Role.Assignable.Description"],
      componentType: "CustomComponent",
      customComponentRendering: (setIsOpen) => assingableRoles(setIsOpen),
      content: <></>,
    });
  }
  return (
    <Dashboard
      action={action}
      cards={[]}
      columnsData={columnsData}
      data={roles?.items}
      detailedFilter={detailedFilters}
      fetchRequest={getRoles}
      isLoading={isLoading}
      rowCount={roles?.totalCount || 0}
      withCards={false}
      withTable
    />
  );
}
