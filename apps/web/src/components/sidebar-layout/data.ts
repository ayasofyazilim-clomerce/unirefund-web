import { AbpUiNavigationResource } from "@/language-data/core/AbpUiNavigation";
import { UniRefund_CRMService_UserAffiliations_UserAffiliationDto as UserAffiliationDto } from "@repo/saas/CRMService";
import { Policy } from "@repo/utils/policies";
import * as LucideIcons from "lucide-react";
type IconName = keyof typeof LucideIcons;

export type NavProps = {
    user: NavUser,
    items: NavItem[],
    affiliations: UserAffiliationDto[],
    languageData: AbpUiNavigationResource,
}
export type NavUser = {
    name: string,
    userName: string,
    email: string,
    signOut: () => void
}
export type NavItemAction = {
    key: string,
    displayName: keyof AbpUiNavigationResource,
    description: keyof AbpUiNavigationResource,
    href?: string,
    policies?: Policy[],
    icon?: IconName,
}
export type NavItem = {
    key: string,
    displayName: keyof AbpUiNavigationResource,
    href?: string,
    icon?: IconName,
    items?: NavItem[],
    displayOrder: number,
    policies?: Policy[],
    split?: "top" | "bottom",
    actions?: NavItemAction[]
}
export const NavItems: NavItem[] = [
    {
        key: "/",
        displayName: "Home",
        href: "home/analytics",
        icon: "Home",
        displayOrder: 1,
    },
    {
        key: "management",
        displayName: "Management",
        icon: "BriefcaseBusiness",
        displayOrder: 1,
        items: [
            {
                key: "management/identity",
                displayName: "Identity",
                icon: "BriefcaseBusiness",
                displayOrder: 1,
                policies: ["UniRefund.Settings"],
                items: [
                    {
                        key: "management/identity/roles",
                        displayName: "Role",
                        href: "management/identity/roles",
                        icon: "KeyRound",
                        displayOrder: 1,
                        policies: ["AbpIdentity.Roles"],
                        actions: [{
                            key: "management/identity/roles/new",
                            displayName: "Role.New",
                            description: "Role.New",
                            href: "management/identity/roles/new",
                            icon: "DiamondPlus",
                            policies: ["AbpIdentity.Roles.Create"]
                        }],
                    },
                    {
                        key: "management/identity/users",
                        displayName: "User",
                        href: "management/identity/users",
                        icon: "Fingerprint",
                        displayOrder: 1,
                        policies: ["AbpIdentity.Users"],
                        actions: [{
                            key: "management/identity/users/new",
                            displayName: "User.New",
                            description: "User.New",
                            href: "management/identity/users/new",
                            icon: "DiamondPlus",
                            policies: ["AbpIdentity.Users.Create"]
                        },]
                    },
                    {
                        key: "management/identity/claim-types",
                        displayName: "ClaimType",
                        href: "management/identity/claim-types",
                        icon: "Scan",
                        displayOrder: 1,
                        policies: ["AbpIdentity.ClaimTypes"],
                        actions: [{
                            key: "management/identity/claim-type/new",
                            displayName: "ClaimType.New",
                            description: "ClaimType.New",
                            href: "management/identity/claim-type/new",
                            icon: "DiamondPlus",
                            policies: ["AbpIdentity.ClaimTypes.Create"]
                        },]
                    },
                    {
                        key: "management/identity/security-logs",
                        displayName: "SecurityLogs",
                        href: "management/identity/security-logs",
                        icon: "Lock",
                        displayOrder: 1,
                        policies: ["AbpIdentity.SecurityLogs"]
                    },
                ]
            },
            {
                key: "management/saas",
                displayName: "Saas",
                icon: "BriefcaseBusiness",
                displayOrder: 1,
                policies: ["Saas.Editions", "Saas.Tenants"],
                items: [{
                    key: "management/saas/editions",
                    displayName: "Edition",
                    href: "management/saas/editions",
                    icon: "WalletCards",
                    displayOrder: 1,
                    policies: ["Saas.Editions"],
                    actions: [{
                        key: "management/saas/editions/new",
                        displayName: "Saas.New",
                        description: "Saas.New",
                        href: "management/saas/editions/new",
                        icon: "DiamondPlus",
                        policies: ["Saas.Editions.Create"]
                    },]
                },
                {
                    key: "management/saas/tenants",
                    displayName: "Tenant",
                    href: "management/saas/tenants",
                    icon: "Globe",
                    displayOrder: 1,
                    policies: ["Saas.Tenants"],
                    actions: [{
                        key: "management/saas/tenants/new",
                        displayName: "Tenant.New",
                        description: "Tenant.New",
                        href: "management/saas/tenants/new",
                        icon: "DiamondPlus",
                        policies: ["Saas.Tenants.Create"]
                    },]
                },
                ]
            },
            {
                key: "management/openiddict",
                displayName: "OpenIdDict",
                icon: "IdCard",
                displayOrder: 1,
                policies: ["OpenIddictPro.Application", "OpenIddictPro.Scope"],
                items: [
                    {
                        key: "management/openiddict/applications",
                        displayName: "Applications",
                        href: "management/openiddict/applications",
                        icon: "Box",
                        displayOrder: 1,
                        policies: ["OpenIddictPro.Application"],
                        actions: [
                            {
                                key: "management/openiddict/applications/new",
                                displayName: "OpenIdDict.New",
                                description: "OpenIdDict.New",
                                href: "management/openiddict/applications/new",
                                icon: "DiamondPlus",
                                policies: ["OpenIddictPro.Application.Create"]
                            },
                        ]
                    },
                    {
                        key: "management/openiddict/scopes",
                        displayName: "Scopes",
                        href: "management/openiddict/scopes",
                        icon: "DiamondPercent",
                        displayOrder: 1,
                        policies: ["OpenIddictPro.Scope"],
                        actions: [{
                            key: "management/openiddict/scopes/new",
                            displayName: "Scopes.New",
                            description: "Scopes.New",
                            href: "management/openiddict/scopes/new",
                            icon: "DiamondPlus",
                            policies: ["OpenIddictPro.Scope.Create"]
                        },]
                    },
                ]
            },
            {
                key: "management/language-management",
                displayName: "LanguageManagement",
                icon: "BriefcaseBusiness",
                displayOrder: 1,
                policies: ["UniRefund.Settings"],
                items: [
                    {
                        key: "management/language-management/languages",
                        displayName: "Languages",
                        href: "management/language-management/languages",
                        icon: "Languages",
                        displayOrder: 1,
                        policies: ["LanguageManagement.Languages"],
                        actions: [
                            {
                                key: "management/language-management/languages/new",
                                displayName: "LanguageManagement.New",
                                description: "LanguageManagement.New",
                                href: "management/language-management/languages/new",
                                icon: "DiamondPlus",
                                policies: ["LanguageManagement.Languages.Create"]
                            },
                        ]
                    },
                    {
                        key: "management/language-management/language-texts",
                        displayName: "LanguageTexts",
                        href: "management/language-management/language-texts",
                        icon: "BookA",
                        displayOrder: 1,
                        policies: ["LanguageManagement.LanguageTexts"]
                    },
                ]
            },
            {
                key: "management/text-templates",
                displayName: "TextTemplates",
                href: "management/text-templates",
                icon: "Text",
                displayOrder: 1,
                policies: ["TextTemplateManagement.TextTemplates"]
            },
            {
                key: "management/logs",
                displayName: "Logs",
                icon: "ScrollText",
                displayOrder: 1,
                policies: ["AuditLogging.AuditLogs"],
                items: [
                    {
                        key: "management/logs/audit",
                        displayName: "Logs",
                        href: "management/logs/audit",
                        icon: "ScrollText",
                        displayOrder: 1,
                        policies: ["AuditLogging.AuditLogs"]
                    },
                    {
                        key: "management/logs/entity-changes",
                        displayName: "Logs",
                        href: "management/logs/entity-changes",
                        icon: "ScrollText",
                        displayOrder: 1,
                        policies: ["AuditLogging.AuditLogs"]
                    },
                ]
            },
            {
                key: "management/file",
                displayName: "File",
                icon: "FileIcon",
                displayOrder: 1,
                policies: ["FileService.File"],
                items: [
                    {
                        key: "management/file/providers",
                        displayName: "Providers",
                        href: "management/file/providers",
                        icon: "Server",
                        displayOrder: 1,
                        policies: ["FileService.Provider"]
                    },
                    {
                        key: "management/file/mime-types",
                        displayName: "MimeTypes",
                        href: "management/file/mime-types",
                        icon: "FileSliders",
                        displayOrder: 1,
                        policies: ["FileService.MimeType"]
                    },
                    {
                        key: "management/file/file-types",
                        displayName: "FileTypes",
                        href: "management/file/file-types",
                        icon: "FileType2",
                        displayOrder: 1,
                        policies: ["FileService.FileType"]
                    },
                    {
                        key: "management/file/file-type-mime-types",
                        displayName: "FileTypeMimeTypes",
                        href: "management/file/file-type-mime-types",
                        icon: "FileSpreadsheet",
                        displayOrder: 1,
                        policies: ["FileService.FileTypeMimeType"]
                    },
                    {
                        key: "management/file/file-type-groups",
                        displayName: "FileTypeGroups",
                        href: "management/file/file-type-groups",
                        icon: "FileStack",
                        displayOrder: 1,
                        policies: ["FileService.FileTypeGroup"]
                    },
                    {
                        key: "management/file/file-relation-entities",
                        displayName: "FileRelationEntities",
                        href: "management/file/file-relation-entities",
                        icon: "FileKey",
                        displayOrder: 1,
                        policies: ["FileService.FileRelationEntity"]
                    },
                    {
                        key: "management/file/verification",
                        displayName: "FileVerification",
                        href: "management/file/verification",
                        icon: "FileBadge",
                        displayOrder: 1,
                        policies: ["FileService.File"],
                    },
                ]
            },

        ],
    },
    {
        key: "settings",
        displayName: "Settings",
        icon: "Settings",
        displayOrder: 1,
        items: [
            {
                key: "settings/product",
                displayName: "Product",
                icon: "Settings",
                displayOrder: 1,
                items: [{
                    key: "settings/product/vats",
                    displayName: "VAT",
                    href: "settings/product/vats",
                    icon: "HandCoins",
                    displayOrder: 1,
                    policies: ["SettingService.Vats"],
                    actions: [
                        {
                            key: "settings/product/vats/new",
                            displayName: "VAT.New",
                            description: "VAT.New",
                            href: "settings/product/vats/new",
                            icon: "DiamondPlus",
                            policies: ["SettingService.Vats.Add"]
                        },
                    ]
                },
                {
                    key: "settings/product/product-groups",
                    displayName: "ProductGroup",
                    href: "settings/product/product-groups",
                    icon: "ScanLine",
                    displayOrder: 1,
                    policies: ["SettingService.ProductGroupVats"],
                    actions: [
                        {
                            key: "settings/product/product-groups/new",
                            displayName: "ProductGroup.New",
                            description: "ProductGroup.New",
                            href: "settings/product/product-groups/new",
                            icon: "DiamondPlus",
                            policies: ["SettingService.ProductGroupVats.Add"]
                        },
                    ]
                },
                ]
            },

            {
                key: "settings/tenant",
                displayName: "Tenant",
                href: "settings/tenant",
                icon: "Settings",
                displayOrder: 1,
            },
            {
                key: "settings/templates",
                displayName: "Templates",
                icon: "Layers",
                displayOrder: 1,
                items: [
                    {
                        key: "settings/templates/refund-fees",
                        displayName: "RefundFees",
                        href: "settings/templates/refund-fees",
                        icon: "Settings",
                        displayOrder: 1,
                        policies: ["ContractService.RefundFeeHeader"],
                        actions: [
                            {
                                key: "settings/templates/refund-fees/new",
                                displayName: "RefundFees.New",
                                description: "RefundFees.New",
                                href: "settings/templates/refund-fees/new",
                                icon: "DiamondPlus",
                                policies: ["ContractService.RefundFeeHeader.Create"]
                            },
                        ]
                    },

                    {
                        key: "settings/templates/refund-tables",
                        displayName: "RefundTables",
                        href: "settings/templates/refund-tables",
                        icon: "Settings",
                        displayOrder: 1,
                        policies: ["ContractService.RefundTableHeader"],
                        actions: [
                            {
                                key: "settings/templates/refund-tables/new",
                                displayName: "RefundTables.New",
                                description: "RefundTables.New",
                                href: "settings/templates/refund-tables/new",
                                icon: "DiamondPlus",
                                policies: ["ContractService.RefundTableHeader.Create"]
                            },
                        ]
                    },
                    {
                        key: "settings/templates/rebate-tables",
                        displayName: "Rebate",
                        href: "settings/templates/rebate-tables",
                        icon: "Settings",
                        displayOrder: 1,
                        policies: ["ContractService.RebateTableHeader"],
                        actions: [
                            {
                                key: "settings/templates/rebate-tables/new",
                                displayName: "Rebate.New",
                                description: "Rebate.New",
                                href: "settings/templates/rebate-tables/new",
                                icon: "DiamondPlus",
                                policies: ["ContractService.RebateTableHeader.Create"]
                            },
                        ]
                    },
                ]
            },
        ]
    },
    {
        key: "parties",
        displayName: "Parties",
        icon: "Layers",
        displayOrder: 1,
        items: [
            {
                key: "parties/merchants",
                displayName: "Merchants",
                href: "parties/merchants?typeCode=HEADQUARTER",
                icon: "ShoppingBag",
                displayOrder: 1,
                policies: ["CRMService.Merchants"],
                actions: [{
                    key: "parties/merchants/new",
                    displayName: "Merchants.New",
                    description: "Merchants.New",
                    href: "parties/merchants/new",
                    icon: "DiamondPlus",
                    policies: ["CRMService.Merchants.Create"]
                }]
            },
            {
                key: "parties/refund-points",
                displayName: "RefundPoints",
                href: "parties/refund-points",
                icon: "TicketSlash",
                displayOrder: 1,
                policies: ["CRMService.RefundPoints"],
                actions: [{
                    key: "parties/refund-points/new",
                    displayName: "RefundPoints.New",
                    description: "RefundPoints.New",
                    href: "parties/refund-points/new",
                    icon: "DiamondPlus",
                    policies: ["CRMService.RefundPoints.Create"]
                }]
            },
            {
                key: "parties/customs",
                displayName: "Customs",
                href: "parties/customs",
                icon: "Container",
                displayOrder: 1,
                policies: ["CRMService.Customs"],
                actions: [{
                    key: "parties/customs/new",
                    displayName: "Customs.New",
                    description: "Customs.New",
                    href: "parties/customs/new",
                    icon: "DiamondPlus",
                    policies: ["CRMService.Customs.Create"]
                }]
            },
            {
                key: "parties/tax-free",
                displayName: "TaxFree",
                href: "parties/tax-free",
                icon: "CircleDollarSign",
                displayOrder: 1,
                policies: ["CRMService.TaxFrees"],
                actions: [
                    {
                        key: "parties/tax-free/new",
                        displayName: "TaxFree.New",
                        description: "TaxFree.New",
                        href: "parties/tax-free/new",
                        icon: "DiamondPlus",
                        policies: ["CRMService.TaxFrees.Create"]
                    },
                ]
            },
            {
                key: "parties/tax-offices",
                displayName: "TaxOffices",
                href: "parties/tax-offices",
                icon: "Landmark",
                displayOrder: 1,
                policies: ["CRMService.TaxOffices"],
                actions: [
                    {
                        key: "parties/tax-offices/new",
                        displayName: "TaxOffices.New",
                        description: "TaxOffices.New",
                        href: "parties/tax-offices/new",
                        icon: "DiamondPlus",
                        policies: ["CRMService.TaxOffices.Create"]
                    },
                ]
            },
            {
                key: "parties/individuals",
                displayName: "Individuals",
                href: "parties/individuals",
                icon: "User",
                displayOrder: 1,
                policies: ["CRMService.Individuals"],
                actions: [
                    {
                        key: "parties/individuals/new",
                        displayName: "Individuals.New",
                        description: "Individuals.New",
                        href: "parties/individuals/new",
                        icon: "DiamondPlus",
                        policies: ["CRMService.Individuals.Create"]
                    },
                ]
            },
            {
                key: "parties/travellers",
                displayName: "Travellers",
                href: "parties/travellers",
                icon: "Plane",
                displayOrder: 1,
                policies: [
                    "TravellerService.Travellers",
                    "TravellerService.Travellers.ViewList",
                    "LocationService.Countries",
                    "LocationService.Countries.ViewList"
                ],
                actions: [
                    {
                        key: "parties/travellers/new",
                        displayName: "Travellers.New",
                        description: "Travellers.New",
                        href: "parties/travellers/new",
                        icon: "DiamondPlus",
                        policies: ["TravellerService.Travellers.Create"]
                    },
                ]
            },

        ]
    },
    {
        key: "operations",
        displayName: "Operations",
        icon: "Handshake",
        displayOrder: 1,
        items: [
            {
                key: "operations/new-tag",
                displayName: "NewTag",
                href: "operations/new-tag",
                icon: "DiamondPlus",
                displayOrder: 1,
                policies: [
                    "CRMService.Merchants",
                    "CRMService.Merchants.View",
                    "TravellerService.Travellers",
                    "TravellerService.Travellers.Detail",
                    "TagService.Tags",
                    "TagService.Tags.Create"
                ]
            },
            {
                key: "operations/tax-free-tags",
                displayName: "TaxFreeTags",
                href: "operations/tax-free-tags",
                icon: "Tag",
                displayOrder: 1,
                policies: ["TagService.Tags", "TagService.Tags.View", "TagService.Tags.ViewSummary"]
            },
            {
                key: "operations/refund",
                displayName: "Refund",
                href: "operations/refund?status=export-validated",
                icon: "LayoutDashboard",
                displayOrder: 1,
                policies: [
                    "TagService.Tags",
                    "RefundService.Refunds",
                    "RefundService.Refunds.Create",
                    "RefundService.Refunds.View"
                ]
            },
            {
                key: "operations/refunds",
                displayName: "Refunds",
                href: "operations/refunds",
                icon: "LayoutDashboard",
                displayOrder: 1,
                policies: ["RefundService.Refunds"]
            },
            {
                key: "operations/export-validations",
                displayName: "ExportValidation",
                href: "operations/export-validations",
                icon: "CircleDollarSign",
                displayOrder: 1,
                policies: ["ExportValidationService.ExportValidations"]
            },
        ]
    },
    {
        key: "finance",
        displayName: "Finance",
        icon: "CircleDollarSign",
        displayOrder: 1,
        items: [{
            key: "finance/vat-statements",
            displayName: "VatStatements",
            href: "finance/vat-statements",
            icon: "ScrollText",
            displayOrder: 1,
            policies: ["FinanceService.VATStatementHeaders"],
            actions: [{
                key: "finance/vat-statements/new",
                displayName: "VatStatements.New",
                description: "VatStatements.New",
                href: "finance/vat-statements/new",
                icon: "DiamondPlus",
                policies: ["FinanceService.VATStatementHeaders.Create"]
            }]
        },
        {
            key: "finance/rebate-statements",
            displayName: "RebateStatements",
            href: "finance/rebate-statements",
            icon: "ScrollText",
            displayOrder: 1,
            policies: ["FinanceService.RebateStatementHeaders"],
            actions: [{
                key: "finance/rebate-statements/new",
                displayName: "RebateStatements.New",
                description: "RebateStatements.New",
                href: "finance/rebate-statements/new",
                icon: "DiamondPlus",
                policies: ["FinanceService.RebateStatementHeaders.Create"]
            }]
        }]
    },
]

