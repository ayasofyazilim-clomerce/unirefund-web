import {Button} from "@/components/ui/button";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {FileSliders} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function CheckIsFormReady({
  lang,
  languageData,
  taxOfficeListLength,
}: {
  lang: string;
  languageData: CRMServiceServiceResource;
  taxOfficeListLength?: number;
}) {
  const {grantedPolicies} = useGrantedPolicies();

  if (taxOfficeListLength !== undefined && taxOfficeListLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <FileSliders className="size-20 text-gray-400" />,
        title: languageData["CRM.Messages.MissingTaxOffice.Title"],
        message: languageData["CRM.Messages.MissingTaxOffice.Message"],
        action: isActionGranted(["CRMService.TaxOffices.Create"], grantedPolicies) ? (
          <Action label={languageData["Form.TaxOffice.Create"]} link={getBaseLink("parties/tax-offices/new", lang)} />
        ) : null,
      },
    };
  }
  return {
    isActive: false,
    content: null,
  };
}

function Action({link, label}: {link: string; label: string}) {
  return (
    <Button asChild className="text-blue-500" data-testid="form-ready-action-button" variant="link">
      <Link data-testid="form-ready-action-link" href={link}>
        {label}
      </Link>
    </Button>
  );
}
