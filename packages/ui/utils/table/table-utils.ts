import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import jsonToCsv from "@repo/ayasofyazilim-ui/lib/json-to-csv";
import type {ColumnFilter, ColumnsType, TableAction} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import type {AutoFormProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface FormModifier {
  actionList?: (controlledFetch: unknown, getRoles: unknown) => TableAction[];
  formPositions?: string[];
  formSubPositions?: Record<string, string[]>;
  excludeList?: string[];
  schema: Record<string, any>;
  convertors?: Record<string, any>;
  dependencies?: AutoFormProps["dependencies"];
}

export interface TableData {
  createFormSchema?: FormModifier;
  editFormSchema?: FormModifier;
  tableSchema: FormModifier;
  title?: string; //should be removed in future
  translationKey?: string; // for translation purposes
  filterBy?: string;
  detailedFilters?: ColumnFilter[];
}

export async function getTableDataServerSide<T>(
  fetchFunction: () => Promise<{
    type: string;
    data: T | null;
    status: number;
    message: string;
  }>,
) {
  try {
    const result = await fetchFunction();
    if (result.type !== "success") {
      toast.error(result.message);
    }
    return result.data;
  } catch {
    toast.error("Fetch error");
    return null;
  }
}
export async function deleteTableRowServerSide<T>(
  deleteFunction: () => Promise<{
    type: string;
    data: T | null;
    status: number;
    message: string;
  }>,
) {
  try {
    const result = await deleteFunction();
    if (result.type !== "success") {
      toast.error(result.message);
    } else {
      toast.success("Data deleted successfully");
    }
    return result.data;
  } catch {
    toast.error("Fetch error");
    return null;
  }
}

export function AUTO_COLUMNS_DATA(formData: FormModifier): ColumnsType {
  return {
    type: "Auto",
    data: {
      tableType: formData.schema,
      excludeList: formData.excludeList || [],
      actionList: [],
    },
  };
}

export function DELETE_ROW_ACTION(
  languageData: {
    Delete: string;
    Cancel: string;
    "Delete.Assurance": string;
  },
  callbackFunction: (data: {id: string}) => void,
): TableAction {
  return {
    cta: languageData.Delete,
    type: "Dialog",
    componentType: "ConfirmationDialog",
    description: languageData["Delete.Assurance"],
    cancelCTA: languageData.Cancel,
    variant: "destructive",
    callback: (data: {id: string}) => {
      callbackFunction(data);
    },
  };
}
export function EDIT_ROW_ON_NEW_PAGE(
  languageData: {
    Edit: string;
  },
  targetLink: string,
  router: AppRouterInstance,
): TableAction {
  return {
    cta: languageData.Edit,
    type: "Action",
    callback: (row: {id: string}) => {
      router.push(`${targetLink}/${row.id}`);
    },
  };
}

export function TableAction_CREATE_ROW_ON_NEW_PAGE(title: string, targetLink: string): TableAction {
  return {
    cta: title,
    type: "NewPage",
    href: targetLink,
  };
}
export function TableAction_EXPORT_CSV<T>(tableData: T, fileName: string): TableAction {
  return {
    cta: `Export CSV`,
    callback: () => {
      jsonToCsv(tableData, fileName);
    },
    type: "Action",
  };
}

export function getEnumId(data: {name: string; id: string}[], value: string) {
  return data?.find((item) => item.name === value)?.id || "";
}
export function getEnumName(data: {name: string; id: string}[], value: string) {
  return data?.find((item) => item.id === value)?.name || "";
}

export function convertZod(schema: FormModifier) {
  const newSchema = createZodObject(schema.schema, schema.formPositions || [], schema.convertors || {});
  return newSchema;
}
