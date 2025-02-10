"use client";

import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import type {
  ColumnFilter,
  fetchRequestProps,
  FilterColumnResult,
  TableAction,
} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import {AutoFormProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import type {FormModifier} from "@repo/ui/utils/table/table-utils";
import {
  AUTO_COLUMNS_DATA,
  convertZod,
  DELETE_ROW_ACTION,
  EDIT_ROW_ON_NEW_PAGE,
  TableAction_CREATE_ROW_ON_NEW_PAGE,
  TableAction_EXPORT_CSV,
} from "@repo/ui/utils/table/table-utils";
import {useRouter} from "next/navigation";
import {useState} from "react";

type CustomDialogItem = {
  type: "row" | "table";
  title: string;
  content: JSX.Element;
};

type AutoFormDialogItem = Pick<AutoFormProps, "values" | "dependencies" | "fieldConfig"> & {
  type: "row" | "table";
  title: string;
  formPositions?: string[];
  onCallback: (row: any, values: unknown) => void;
  schema: FormModifier;
};

export default function TableComponent({
  fetchRequest,
  deleteRequest,
  tableSchema,
  createOnNewPage,
  createOnNewPageUrl,
  createOnNewPageTitle,
  deleteableRow,
  editOnNewPage,
  editOnNewPageUrl,
  detailedFilter,
  customDialog,
  autoFormDialog,
  languageData,
}: {
  tableSchema: FormModifier;
  deleteableRow?: boolean;
  editOnNewPage?: boolean;
  createOnNewPage?: boolean;
  createOnNewPageUrl?: string;
  createOnNewPageTitle?: string;
  editOnNewPageUrl?: string;
  customDialog?: CustomDialogItem[];
  autoFormDialog?: AutoFormDialogItem[];
  detailedFilter?: ColumnFilter[];
  fetchRequest: (
    page: number,
    filter?: FilterColumnResult,
  ) => Promise<{
    type: string;
    data: {items: unknown[]; totalCount: number};
  }>;
  deleteRequest?: (id: string) => Promise<{
    type: string;
    data?: unknown;
  }>;
  languageData: any;
}) {
  const router = useRouter();
  const [tableData, setTableData] = useState<{
    items: unknown[];
    totalCount: number;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const isWindowExists = typeof window !== "undefined";

  function getData({page, filter}: fetchRequestProps) {
    // setIsLoading(true);
    fetchRequest(page, filter)
      .then((res) => {
        if (res.type === "success") {
          setTableData(res?.data);
          setIsLoading(false);
        } else {
          toast.error(res.type + ": " + languageData["Fetch.Fail"] + " " + JSON.stringify(res?.data));
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("unknown table: " + languageData["Fetch.Fail"]);
      });
  }

  function deleteRow(row: {id: string}) {
    if (!deleteRequest) return;
    setIsLoading(true);
    deleteRequest(row.id)
      .then((res) => {
        if (res.type === "success") {
          getData({page: 0, filter: {}});
          toast.success(languageData["Delete.Success"]);
        } else {
          setIsLoading(false);
          toast.error(res.data || languageData["Delete.Fail"]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        toast.error(languageData["Delete.Fail"]);
      });
  }

  const columnsData = AUTO_COLUMNS_DATA(tableSchema);

  if (editOnNewPage) {
    columnsData.data.actionList?.push(
      EDIT_ROW_ON_NEW_PAGE(languageData, editOnNewPageUrl || (isWindowExists ? window.location.href : ""), router),
    );
  }

  if (deleteableRow) {
    columnsData.data.actionList?.push(DELETE_ROW_ACTION(languageData, deleteRow));
  }

  const action: TableAction[] = [];

  if (createOnNewPage) {
    action.unshift(
      TableAction_CREATE_ROW_ON_NEW_PAGE(
        createOnNewPageTitle || languageData.New,
        createOnNewPageUrl || (isWindowExists ? `${window.location.href}/new` : ""),
      ),
    );
  }

  if (customDialog) {
    customDialog.forEach((dialog) => {
      const _action: TableAction = {
        type: "Dialog",
        cta: dialog.title,
        loadingContent: <>{languageData.Loading}</>,
        description: dialog.title,
        componentType: "CustomComponent",
        content: dialog.content,
      };
      if (dialog.type === "row") {
        columnsData.data.actionList?.push(_action);
        return;
      }
      action?.push(_action);
    });
  }
  if (autoFormDialog) {
    autoFormDialog.forEach((dialog) => {
      const formSchema = convertZod(dialog.schema);
      const _action: TableAction = {
        cta: dialog.title,
        description: dialog.title,
        type: "Dialog",
        componentType: "Autoform",
        autoFormArgs: {
          ...dialog,
          formSchema,
          submit: {
            cta: languageData["Save"],
          },
        },
        callback: (data, row) => {
          dialog.onCallback(data, row);
        },
      };
      if (dialog.type === "row") {
        columnsData.data.actionList?.push(_action);
        return;
      }
      action?.push(_action);
    });
  }
  action.push(TableAction_EXPORT_CSV<{items: unknown[]; totalCount: number} | undefined>(tableData, "export.csv"));

  return (
    <Dashboard
      action={action}
      cards={[]}
      columnsData={columnsData}
      data={tableData?.items || []}
      detailedFilter={detailedFilter}
      fetchRequest={getData}
      isLoading={isLoading}
      rowCount={tableData?.totalCount || 0}
      withCards={false}
      withTable
    />
  );
}
