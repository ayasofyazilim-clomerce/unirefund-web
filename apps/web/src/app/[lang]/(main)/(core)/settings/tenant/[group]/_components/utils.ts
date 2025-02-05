import type {
  UniRefund_AdministrationService_Bonds_BondDto,
  UniRefund_AdministrationService_Groups_GroupDto,
  UniRefund_AdministrationService_Items_GroupItemDto,
} from "@ayasofyazilim/saas/AdministrationService";
import type {JsonSchema, SchemaType} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {DependenciesType, DependencyType, FieldConfig} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import {description} from "./description";

export type AllowedValueTypeModelNameStringEnum =
  | "ToggleStringValueType"
  | "FreeTextStringValueType"
  | "SelectionStringValueType"
  | "BooleanValueType"
  | "NumericValueType"
  | ""
  | null;

export function isGroupDto(object: object): object is UniRefund_AdministrationService_Groups_GroupDto {
  return "isEnabled" in object;
}

function createConfig(
  item: UniRefund_AdministrationService_Items_GroupItemDto,
  languageData: AdministrationServiceResource,
): Record<string, {description: string; displayName: string; fieldType?: string}> {
  const key = item.key || "";
  const config: Record<string, {description: string; displayName: string; fieldType?: string}> = {
    [key]: {
      description: languageData[item.description as keyof typeof languageData] || item.description || "",
      displayName: languageData[item.displayName as keyof typeof languageData] || item.displayName || "",
    },
  };

  if (
    item.valueType?.name &&
    convertValueTypeNameToFieldType(item.valueType.name as AllowedValueTypeModelNameStringEnum)
  ) {
    config[key].fieldType = convertValueTypeNameToFieldType(item.valueType.name as AllowedValueTypeModelNameStringEnum);
  }
  return config;
}
function subField(
  item: UniRefund_AdministrationService_Items_GroupItemDto,
  languageData: AdministrationServiceResource,
) {
  if (item.subItems && item.subItems.length > 0) {
    const subitemconfigs = item.subItems.map((subitem: UniRefund_AdministrationService_Items_GroupItemDto) => {
      if (subitem.subItems && subitem.subItems.length > 0) {
        const subsubitemconfigs = subitem.subItems.map(
          (subsubitem: UniRefund_AdministrationService_Items_GroupItemDto) => {
            return createConfig(subsubitem, languageData);
          },
        );
        const key = subitem.key || "";
        return {
          [key]: {
            ...subsubitemconfigs.reduce((acc, curr) => ({...acc, ...curr}), {}),
            displayName: languageData[subitem.displayName as keyof typeof languageData] || subitem.displayName,
            description: description(
              languageData[subitem.description as keyof typeof languageData] || subitem.description || "",
            ),
          },
        };
      }
      return createConfig(subitem, languageData);
    });
    const key = item.key || "";
    const subs = {
      [key]: {
        ...subitemconfigs.reduce((acc, curr) => ({...acc, ...curr}), {}),
        displayName: languageData[item.displayName as keyof typeof languageData] || item.displayName,
        description: description(languageData[item.description as keyof typeof languageData] || item.description || ""),
      },
    };
    return subs;
  }
  return createConfig(item, languageData);
}
export function createFieldConfig(
  object: UniRefund_AdministrationService_Groups_GroupDto,
  languageData: AdministrationServiceResource,
): FieldConfig<Record<string, string | boolean | number>> {
  const configs = object.items?.map((item: UniRefund_AdministrationService_Items_GroupItemDto) => {
    if (item.subItems && item.subItems.length > 0) {
      return subField(item, languageData);
    }
    return createConfig(item, languageData);
  });
  const config: FieldConfig<Record<string, string | boolean | number>> = {};
  if (configs) {
    Object.assign(config, ...Object.values(configs));
  }
  return config;
}

interface CreateBondType {
  bonds: UniRefund_AdministrationService_Bonds_BondDto[];
  targetField: string;
  parentField?: string;
}
interface BondType {
  sourceField: string;
  targetField: string;
  type?: DependencyType;
  hasParentField: boolean;
  when: (val: string) => boolean;
}

function createSafeRegex(val: string, pattern: string | undefined | null) {
  if (!pattern) return true;
  return new RegExp(pattern).test(val);
}
function createBonds(sett: CreateBondType): BondType[] {
  return sett.bonds.map((bond) => {
    const sourceField = sett.parentField ? `${sett.parentField}.${bond.key}` : bond.key;
    const createdBond: BondType = {
      sourceField: sourceField ?? "", //bond.key is not nullable fix it
      targetField: sett.targetField,
      type: bond.type as DependencyType,
      hasParentField: Boolean(sett.parentField),
      when: (val: string) => createSafeRegex(val, bond.pattern),
    };
    return createdBond;
  });
}
export function createDependencies(group: UniRefund_AdministrationService_Groups_GroupDto): DependenciesType {
  const bonds = group.items?.map((item: UniRefund_AdministrationService_Items_GroupItemDto) => {
    if (item.subItems && item.subItems.length > 0) {
      const subitembonds = item.subItems.map((subitem: UniRefund_AdministrationService_Items_GroupItemDto) => {
        return createBonds({
          bonds: subitem.bonds || [],
          targetField: subitem.key || "",
          parentField: item.key || "",
        });
      });
      const x = createBonds({
        bonds: item.bonds || [],
        targetField: item.key || "",
      });
      subitembonds.push(x);
      return subitembonds.flat();
    }
    if (item.bonds && item.bonds.length > 0) {
      return createBonds({
        bonds: item.bonds,
        targetField: item.key || "",
      });
    }
    return [];
  });
  if (!bonds) return [];
  return bonds.flat() as DependenciesType;
}
function convertValueTypeNameToFieldType(type: AllowedValueTypeModelNameStringEnum) {
  switch (type) {
    case "ToggleStringValueType":
      return "switch";
    case "FreeTextStringValueType":
    case "SelectionStringValueType":
    default:
      return undefined;
  }
}
function convertValueTypeNameToSchemaType(type: AllowedValueTypeModelNameStringEnum | undefined) {
  switch (type) {
    case "ToggleStringValueType":
      return "boolean";
    case "FreeTextStringValueType":
      return "string";
    case "SelectionStringValueType":
      return "select";
    case "BooleanValueType":
      return "boolean";
    default:
      return "string";
  }
}
function createProperties(
  item: UniRefund_AdministrationService_Items_GroupItemDto,
): Record<string, JsonSchema> | object {
  const key = item.key || "";
  if (!item.valueType) return {};
  if (item.subItems && item.subItems.length > 0) return {[key]: createSchema(undefined, item)};
  return {
    [key]: createJsonSchema(item),
  };
}
//Creates item & parent schema
export function createSchema(
  group?: UniRefund_AdministrationService_Groups_GroupDto,
  item?: UniRefund_AdministrationService_Items_GroupItemDto,
): SchemaType {
  let properties: Record<string, JsonSchema> = {};
  if (group) {
    properties = {};
    if (group.items) {
      for (const _item of group.items) {
        Object.assign(properties, createProperties(_item));
      }
    }
  } else if (item) {
    if (item.subItems && item.subItems.length > 0) {
      properties = {};
      for (const subitem of item.subItems) {
        Object.assign(properties, createProperties(subitem));
      }
    }
  }
  let key = "";
  if (group) {
    key = group.key;
  } else if (item) {
    key = item.key;
  }
  return {
    displayName: key,
    required: [key],
    type: "object",
    properties,
    additionalProperties: false,
  };
}
//Creates item schema
function createJsonSchema(item: UniRefund_AdministrationService_Items_GroupItemDto): JsonSchema {
  let schema: JsonSchema = {
    type: convertValueTypeNameToSchemaType(item.valueType?.name as AllowedValueTypeModelNameStringEnum),
    isRequired: item.isRequired,
    isReadOnly: item.isActive === false,
    maxLength: item.valueType?.validator?.properties?.maxValue,
    default: item.value || item.defaultValue,
    displayName: item.displayName || item.key,
  };
  if (item.valueType && item.valueType.name === "SelectionStringValueType") {
    schema = {
      ...schema,
      enum: item.valueType.itemSource?.items?.map((x) => x.value),
    };
  }
  return schema;
}
