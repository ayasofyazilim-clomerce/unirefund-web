"use client";

import {useTransition} from "react";
import {CreateIndividualForm as IndividualForm} from "../../_components/individual-form";
import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {useRouter} from "next/navigation";
import {getBaseLink} from "@/utils";
import {toast} from "@/components/ui/sonner";

export function CreateIndividualForm({languageData}: {languageData: CRMServiceServiceResource}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  return (
    <IndividualForm
      languageData={languageData}
      useDefaultSubmit={true}
      startTransition={startTransition}
      onSubmit={(response) => {
        if (response.type === "success") {
          router.push(getBaseLink(`parties/individuals/${response.data.id!}/details`));
        } else if(response.type === "api-error") {
          toast.error(response.message);
        }
      }}
    />
  );
}
