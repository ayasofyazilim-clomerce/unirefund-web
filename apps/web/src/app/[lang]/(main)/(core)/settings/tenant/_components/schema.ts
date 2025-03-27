import type {
  UniRefund_AdministrationService_Groups_GroupDto as GroupDto,
  UniRefund_AdministrationService_Items_GroupItemDto as GroupItemDto,
  UniRefund_AdministrationService_Settings_ValueTypes_ValueTypeModelDto as ValueTypeModelDto,
} from "@ayasofyazilim/saas/AdministrationService";
import type {AdministrationServiceResource as Resources} from "src/language-data/core/AdministrationService";

export function createSchema({group, languageData: resources}: {group: GroupDto; languageData: Resources}) {
  if (!group.isEnabled) return {};
  if (!group.items) return {};
  const root: Partial<PropertiesType> = {
    type: "object",
    required: [],
  };
  group.items.forEach((item) => {
    if (item.isRequired) root.required?.push(item.key);
    const $schema = createSchemaItem({item, resources});
    Object.assign(root, {
      properties: {
        ...root.properties,
        [item.key]: $schema,
      },
    });
  });
  return root;
}
function createSchemaItem({item, resources}: {item: GroupItemDto; resources: Resources}) {
  const type = getValueType({valueType: item.valueType});
  let $item: ItemPropertiesType = {
    type,
    title: resources[item.displayName as keyof typeof resources],
    description: resources[item.description as keyof typeof resources],
  };
  if (item.subItems && item.subItems.length > 0) {
    item.subItems.forEach((subItem) => {
      if (item.isRequired) $item.required?.push(subItem.key);
      const $schemaItem = createSchemaItem({item: subItem, resources});
      $item.type = "object";
      $item.properties = {...$item.properties, [subItem.key]: $schemaItem};
    });
  } else {
    $item = {...$item, ...getOptions({item})};
  }
  return $item;
}

type PropertiesType = {
  type: "object";
  required?: string[];
  properties: ItemPropertiesType;
  description?: string;
};
type ItemPropertiesType = {
  type: ValueTypes;
  properties?: Record<string, ItemPropertiesType>;
  required?: string[];
  format?: string;
  description?: string | null | undefined;
  enum?: string[] | number[] | boolean[];
  title?: string;
};
type ValueTypes = "object" | "array" | "string" | "number" | "boolean";

function getValueType({valueType}: {valueType: ValueTypeModelDto | undefined}): ValueTypes {
  //undefined kaldırıalcak
  if (!valueType?.name) {
    return "object";
  }
  switch (valueType.name) {
    case "ToggleStringValueType":
      return "boolean";
    case "SelectionStringValueType":
    case "FreeTextStringValueType":
      switch (valueType.validator?.name) {
        case "GUID":
          return "string";
        case "NUMBER":
        case "NUMERIC":
          return "number";
        case "BOOLEAN":
          return "boolean";
        default:
          return "string";
      }
    default:
      return "object";
  }
}

function getOptions({item}: {item: GroupItemDto}) {
  const validator = item.valueType?.validator;
  const type = getValueType({valueType: item.valueType});
  const properties = {
    type,
    default: item.value || item.defaultValue,
  };
  if (validator?.name === "GUID") {
    Object.assign(properties, {
      format: "uuid",
    });
  }
  if (validator?.name === "NUMBER" || validator?.name === "NUMERIC") {
    Object.assign(properties, {
      format: "int64",
      minimum: validator.properties?.minValue ? validator.properties.minValue : undefined,
      maximum: validator.properties?.maxValue ? validator.properties.maxValue : undefined,
      default:
        item.value === null || item.defaultValue === null
          ? undefined
          : (item.value && parseInt(item.value)) ?? (item.defaultValue && parseInt(item.defaultValue)),
    });
  }
  if (validator?.name === "BOOLEAN") {
    Object.assign(properties, {
      default: false,
    });
  }
  if (item.pattern) {
    Object.assign(properties, {
      pattern: item.pattern,
    });
  }
  if (item.valueType?.name === "SelectionStringValueType") {
    Object.assign(properties, {
      enum: item.valueType.itemSource?.items?.map((i) => i.value) || [],
    });
  }

  return properties;
}

export function createUiSchema({group}: {group: GroupDto}) {
  if (!group.items) return {};
  const uiSchema = {};
  group.items.forEach((item) => {
    const uiSchemaForItem = {
      [item.key]: {},
    };
    if (!item.canTenantChange) Object.assign(uiSchemaForItem[item.key], {"ui:options": {disabled: true}});
    const uiSchemaItem = createUiSchemaItem({item});
    Object.assign(uiSchemaForItem, uiSchemaItem);
    Object.assign(uiSchema, uiSchemaForItem);
  });
  return uiSchema;
}
export function createUiSchemaItem({item}: {item: GroupItemDto}) {
  const uiSchema = {
    [item.key]: {},
  };
  if (!item.canTenantChange) Object.assign(uiSchema[item.key], {"ui:options": {disabled: true}});
  if (!item.subItems || item.subItems.length === 0) {
    if (item.valueType && item.valueType.name === "ToggleStringValueType")
      Object.assign(uiSchema[item.key], {"ui:widget": "switch"});
  } else {
    item.subItems.forEach((subItem) => {
      Object.assign(uiSchema[item.key], createUiSchemaItem({item: subItem}));
    });
  }
  return {...uiSchema};
}
