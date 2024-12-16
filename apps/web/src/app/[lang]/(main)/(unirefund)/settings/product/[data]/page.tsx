/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- TODO: we need to fix this*/
"use client";
import { toast } from "@/components/ui/sonner";
import type {
  PagedResultDto_ProductGroupDto,
  PagedResultDto_VatDto,
  UniRefund_SettingService_Vats_VatDto,
} from "@ayasofyazilim/saas/SettingService";
import {
  createZodObject,
  type SchemaType,
} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import jsonToCSV from "@repo/ayasofyazilim-ui/lib/json-to-csv";
import type {
  ColumnsType,
  fetchRequestProps,
  TableAction,
} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import {
  createFieldConfigWithResource,
  CustomCombobox,
  type AutoFormProps,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import type { FormModifier, TableData } from "@repo/ui/utils/table/table-utils";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getResourceDataClient } from "src/language-data/core/SettingService";
import { getBaseLink } from "src/utils";
import { dataConfigOfManagement } from "../../data";

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

export default function Page({
  params,
}: {
  params: { data: string; domain: string; lang: string };
}): JSX.Element {
  const fetchLink = getBaseLink(`/api/settings/product/${params.data}`);
  const [tableData, setTableData] = useState<
    PagedResultDto_VatDto | PagedResultDto_ProductGroupDto
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData] = useState<TableData>(
    dataConfigOfManagement.product[params.data],
  );
  const languageData = getResourceDataClient(params.lang);
  const [vats, setVats] = useState<UniRefund_SettingService_Vats_VatDto[]>([]);

  async function getVats() {
    const url = getBaseLink(`/api/settings/product/vats`);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setVats(data.items);
    } else {
      toast.error("Failed to fetch VATs");
    }
  }
  useEffect(() => {
    void getVats();
  }, []);

  function getRoles({ page: _page, filter: _filter }: fetchRequestProps) {
    let page = _page;
    const filter = JSON.stringify(_filter) || "";
    if (typeof page !== "number") {
      page = 0;
    }
    const _fetchLink = `${fetchLink}?page=${page}&filter=${filter}`;

    setIsLoading(true);
    function onData(data: any) {
      let returnData = data;
      if (!data?.items) {
        returnData = {
          totalCount: data.length,
          items: data,
        };
      }
      const transformedData = returnData.items;
      setTableData({ ...returnData, items: transformedData });
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

  const translationForm = createFieldConfigWithResource({
    schema: formData.createFormSchema?.schema as SchemaType,
    resources: languageData,
    extend: {
      all: {
        withoutBorder: true,
      },
      vatId: {
        renderer: (props) => (
          <CustomCombobox<UniRefund_SettingService_Vats_VatDto>
            childrenProps={props}
            emptyValue={languageData["Vat.Select"]}
            list={vats}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="percent"
          />
        ),
      },
    },
  });

  const createFormSchema = formData.createFormSchema;
  let action: TableAction[] | undefined;
  if (createFormSchema) {
    action = [
      {
        cta: languageData[
          `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
        ],
        description:
          languageData[
            `${formData.title?.replaceAll(" ", "")}.New` as keyof typeof languageData
          ],
        componentType: "Autoform",
        autoFormArgs: {
          formSchema: createZodObject(
            createFormSchema.schema,
            createFormSchema.formPositions || [],
          ),
          fieldConfig: translationForm,
          submit: {
            cta: languageData["Setting.Save"],
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
          jsonToCSV(tableData, params.data);
        },
        type: "Action",
      },
    ];
  }

  function parseFormValues(schema: FormModifier, data: any) {
    const newSchema = createZodObject(
      schema.schema,
      schema.formPositions || [],
    );
    const transformedSchema = newSchema.transform((val) => {
      const returnObject = { ...val };
      return returnObject;
    });
    const parsed = transformedSchema.parse(data);
    return parsed;
  }

  const onEdit = (data: any, row: any, editFormSchema: any) => {
    const parsedData = parseFormValues(editFormSchema, data);
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
      fieldConfig: translationForm,
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
    description: languageData["Delete.Assurance"],
    cancelCTA: languageData.Cancel,
    variant: "destructive",
    callback: (data) => {
      onDelete(data);
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
        cta: languageData["Setting.Edit.Save"],
      },
    },
    callback: (data, row) => {
      onEdit(data, row, editFormSchema);
    },
  });
  return (
    <Dashboard
      action={action}
      cards={[]}
      columnsData={columnsData}
      data={tableData?.items || []}
      fetchRequest={getRoles}
      isLoading={isLoading}
      rowCount={tableData?.totalCount || 0}
      withCards={false}
      withTable
    />
  );
}
