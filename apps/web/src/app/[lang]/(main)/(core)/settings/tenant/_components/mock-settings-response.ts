import type {UniRefund_AdministrationService_CountrySettings_CountrySettingDto} from "@ayasofyazilim/core-saas/AdministrationService";

export const mockSettingsResponse: UniRefund_AdministrationService_CountrySettings_CountrySettingDto = {
  isEnabled: true,
  groups: [
    {
      isEnabled: true,
      key: "CountryManagement.IssuingFieldManagement",
      displayName: "Issuing - Field management",
      description: "Select the applicable information to issue Tax Free tags in this country",
      items: [
        {
          isEnabled: true,

          isRequired: false,
          isActive: true,
          pattern: null,
          depth: 0,
          description: "test",
          displayName: "Parent Display",
          key: "Parentasd",
          parentName: null,
          value: null,
          defaultValue: "true",
          bonds: [
            {
              key: "Parentasd.IsApplicable",
              pattern: "^false$",
              type: "DISABLES",
            },
          ],
          subItems: [
            {
              isEnabled: true,

              isRequired: false,
              isActive: true,
              pattern: null,
              depth: 0,
              description: null,
              displayName: "Password",
              key: "Password",
              parentName: null,
              value: null,
              defaultValue: null,
              bonds: [
                {
                  key: "IsApplicable",
                  pattern: "^false$",
                  type: "DISABLES",
                },
              ],
              subItems: [
                {
                  isEnabled: true,
                  isRequired: false,
                  isActive: true,
                  pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
                  depth: 0,
                  description: "If traveller's passport is required while issuing.",
                  displayName: "Make mandatory",
                  key: "MakeMandatory", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
                  parentName: null,
                  value: "18",
                  defaultValue: null,
                  bonds: [],
                  subItems: [],
                  valueType: {
                    itemSource: undefined,
                    name: "ToggleStringValueType",
                    properties: "{}",
                    validator: {
                      name: "BOOLEAN",
                      properties: {
                        minValue: 0,
                        maxValue: 0,
                      },
                    },
                  },
                },
                {
                  isEnabled: true,
                  isRequired: false,
                  isActive: true,
                  pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
                  depth: 0,
                  description: "If traveller's passport is required while issuing.",
                  displayName: "Make mandatory",
                  key: "Makemandatory2", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
                  parentName: null,
                  value: "18",
                  defaultValue: null,
                  bonds: [],
                  subItems: [],
                  valueType: {
                    itemSource: undefined,
                    name: "ToggleStringValueType",
                    properties: "{}",
                    validator: {
                      name: "BOOLEAN",
                      properties: {
                        minValue: 0,
                        maxValue: 0,
                      },
                    },
                  },
                },
              ],
              valueType: {
                itemSource: undefined,
                name: null,
                properties: "{}",
                validator: {
                  name: null,
                  properties: {
                    minValue: 0,
                    maxValue: 0,
                  },
                },
              },
            },
            {
              isEnabled: true,

              isRequired: true,
              isActive: true,
              pattern: null,
              depth: 0,
              description: null,
              displayName: "ChildInput",
              key: "ChildInput",
              parentName: null,
              value: "0",
              defaultValue: "0",
              bonds: [],
              subItems: [],
              valueType: {
                itemSource: undefined,
                name: "FreeTextStringValueType",
                properties: "{}",
                validator: {
                  name: "NUMERIC",
                  properties: {
                    minValue: 0,
                    maxValue: 2147483647,
                  },
                },
              },
            },
            {
              isEnabled: true,

              isRequired: false,
              isActive: true,
              pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
              depth: 0,
              description: "If traveller's passport is required while issuing.",
              displayName: "IsApplicable",
              key: "IsApplicable", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
              parentName: null,
              value: "true",
              defaultValue: "false",
              bonds: [],
              subItems: [],
              valueType: {
                itemSource: undefined,
                name: "ToggleStringValueType",
                properties: "{}",
                validator: {
                  name: "BOOLEAN",
                  properties: {
                    minValue: 0,
                    maxValue: 0,
                  },
                },
              },
            },
          ],
          valueType: {
            itemSource: undefined,
            name: null,
            properties: "{}",
            validator: {
              name: null,
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: false,
          isActive: true,
          pattern: null,
          depth: 0,
          description: "",
          displayName: "DateOfBirth",
          key: "DateOfBirth",
          parentName: null,
          value: null,
          defaultValue: null,
          bonds: [],
          subItems: [
            {
              isEnabled: true,

              isRequired: false,
              isActive: true,
              pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
              depth: 0,
              description: "If traveller's passport is required while issuing.",
              displayName: "MakeMandatory",
              key: "MakeMandatory2xx", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
              parentName: null,
              value: "true",
              defaultValue: "true",
              bonds: [],
              subItems: [],
              valueType: {
                itemSource: undefined,
                name: "ToggleStringValueType",
                properties: "{}",
                validator: {
                  name: "BOOLEAN",
                  properties: {
                    minValue: 0,
                    maxValue: 0,
                  },
                },
              },
            },
            {
              isEnabled: true,

              isRequired: true,
              isActive: true,
              pattern: null,
              depth: 0,
              description:
                "Minimum age a traveller should be to be eligible to shop Tax Free. Leave empty or 0 (zero) if you don't want to apply the rule.",
              displayName: "MinimumTravellerAge",
              key: "MinimumTravellerAge",
              parentName: null,
              value: "asdasd",
              defaultValue: "asdasd",
              bonds: [
                {
                  key: "MakeMandatory2xx",
                  pattern: "^false$",
                  type: "DISABLES",
                },
              ],
              subItems: [],
              valueType: {
                itemSource: undefined,
                name: "FreeTextStringValueType",
                properties: "{}",
                validator: {
                  name: "NUMERIC",
                  properties: {
                    minValue: 0,
                    maxValue: 2147483647,
                  },
                },
              },
            },
          ],
          valueType: {
            itemSource: undefined,
            name: null,
            properties: "{}",
            validator: {
              name: null,
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: null,
          depth: 0,
          description: null,
          displayName: "FormAlertAmount",
          key: "FormAlertAmount",
          parentName: null,
          value: "true",
          defaultValue: "true",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "FreeTextStringValueType",
            properties: "{}",
            validator: {
              name: "NUMERIC",
              properties: {
                minValue: 0,
                maxValue: 2147483647,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: null,
          depth: 0,
          description: null,
          displayName: "Formrefillfactor",
          key: "Formrefillfactor",
          parentName: null,
          value: "0",
          defaultValue: "0",
          bonds: [
            {
              key: "FormAlertAmount",
              pattern: "^true$",
              type: "DISABLES",
            },
          ],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "FreeTextStringValueType",
            properties: "{}",
            validator: {
              name: "NUMERIC",
              properties: {
                minValue: 0,
                maxValue: 2147483647,
              },
            },
          },
        },
      ],
    },
    {
      isEnabled: true,
      key: "CountryManagement.Services",
      displayName: "Services",
      description: "Select the applicable information to issue Tax Free tags in this country",
      items: [
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Exchange", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Tour guide", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Eligibility Service", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "false",
          defaultValue: "false",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description:
            "Number of hours that the last eligibility check is valid for. Leave empty or 0 (zero) if eligibility check should be done every time it is required.",
          displayName: "MakeMandatory",
          key: "Eligibility check result validity (hours)", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "0",
          defaultValue: "0",
          bonds: [
            {
              key: "Eligibility Service",
              pattern: "^false$",
              type: "DISABLES",
            },
          ],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "FreeTextStringValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Allow eligibility complaint", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
      ],
    },
    {
      isEnabled: true,
      key: "CountryManagement.Invoicing",
      displayName: "Invoicing",
      description: "CountryManagement.InputExample.Description",
      items: [
        {
          isEnabled: true,

          isRequired: false,
          isActive: true,
          pattern: "trial",
          depth: 0,
          description: "",
          displayName: "LDAP Login",
          key: "Invoice sale type",
          parentName: null,
          value: "Optional",
          defaultValue: "Double Sale",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: {
              items: [
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item0.DisplayText.Name.Optional",
                    resourceName: "SettingService",
                  },
                  value: "Single Sale",
                },
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item1.DisplayText.Name.Disabled",
                    resourceName: "SettingService",
                  },
                  value: "Double Sale",
                },
              ],
            },
            name: "SelectionStringValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Rebate", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: "true",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: false,
          isActive: true,
          pattern: "trial",
          depth: 0,
          description: "",
          displayName: "LDAP Login",
          key: "Rebate invoicing",
          parentName: null,
          value: "Optional",
          defaultValue: "Advice",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: {
              items: [
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item0.DisplayText.Name.Optional",
                    resourceName: "SettingService",
                  },
                  value: "None",
                },
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item1.DisplayText.Name.Disabled",
                    resourceName: "SettingService",
                  },
                  value: "Advice",
                },
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item1.DisplayText.Name.Disabled",
                    resourceName: "SettingService",
                  },
                  value: "Self-billing Invoice",
                },
                {
                  displayText: {
                    name: "CountryManagement.InputExample.SelectableInputExample.ValueType.Item1.DisplayText.Name.Disabled",
                    resourceName: "SettingService",
                  },
                  value: "Both",
                },
              ],
            },
            name: "SelectionStringValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: null,
          depth: 0,
          description: "",
          displayName: "WelcomeText",
          key: "Min amount of rebate",
          parentName: null,
          value: "0",
          defaultValue: "250",
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "FreeTextStringValueType",
            properties: "{}",
            validator: {
              name: "STRING",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Ropo invoice service", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Invoicing exported", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
        {
          isEnabled: true,

          isRequired: true,
          isActive: true,
          pattern: "^(1[89]|[2-5][0-9]|6[0-5])$",
          depth: 0,
          description: "",
          displayName: "MakeMandatory",
          key: "Direct Debit", //"CountryManagement.IssuingFieldManagement.Passport.MakeMandatory",
          parentName: null,
          value: "true",
          defaultValue: null,
          bonds: [],
          subItems: [],
          valueType: {
            itemSource: undefined,
            name: "BooleanValueType",
            properties: "{}",
            validator: {
              name: "BOOLEAN",
              properties: {
                minValue: 0,
                maxValue: 0,
              },
            },
          },
        },
      ],
    },
  ],
};
