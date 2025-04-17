"use client";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {ActionList} from "@repo/ui/action-button";
import {handleDeleteResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {deleteIndividualsByIdApi} from "@repo/actions/unirefund/CrmService/delete-actions";
import {getBaseLink} from "@/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export default function IndividualActionList({
  partyId,
  languageData,
  lang,
}: {
  partyId: string;
  languageData: CRMServiceServiceResource;
  lang: string;
}) {
  const {grantedPolicies} = useGrantedPolicies();
  const router = useRouter();
  return (
    <ActionList className="border-none p-0">
      {isActionGranted(["SettingService.Vats.Delete"], grantedPolicies) && (
        <ConfirmDialog
          closeProps={{
            children: languageData.Cancel,
          }}
          confirmProps={{
            variant: "destructive",
            children: languageData.Delete,
            onConfirm: () => {
              void deleteIndividualsByIdApi(partyId || "").then((res) => {
                handleDeleteResponse(res, router, getBaseLink("parties/individuals", lang));
              });
            },
            closeAfterConfirm: true,
          }}
          description={languageData["Delete.Assurance"]}
          title={languageData.Delete}
          triggerProps={{
            children: (
              <>
                <Trash2 className="mr-2 w-4" /> {languageData.Delete}
              </>
            ),
            variant: "outline",
          }}
          type="with-trigger"
        />
      )}
    </ActionList>
  );
}
