"use client";

import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "@/components/ui/sonner";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {getBaseLink} from "@/utils";
import {CreateIndividualForm as IndividualForm} from "../../_components/individual-form";

export function CreateIndividualForm({languageData}: {languageData: CRMServiceServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <IndividualForm
      isPending={isPending}
      languageData={languageData}
      onSubmit={(response) => {
        if (response.type === "success") {
          router.push(getBaseLink(`parties/individuals/${response.data.id || "undefined"}/details`));
        } else {
          toast.error(response.message);
        }
      }}
      startTransition={startTransition}
      useDefaultSubmit
    />
  );
}
