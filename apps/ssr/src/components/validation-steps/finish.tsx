import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CheckCircle, LogIn} from "lucide-react";
import {useSession} from "@repo/utils/auth";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";
import {getBaseLink} from "src/utils";

interface SuccessModalProps {
  languageData: SSRServiceResource;
}

const SuccessModal: React.FC<SuccessModalProps> = ({languageData}) => {
  const {session} = useSession();
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <CheckCircle className="text-primary h-12 w-12" />
        </div>

        <div className="mb-6">
          {session ? (
            <>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">{languageData.IdentityVerificationSuccessful}</h3>
              <p className="text-gray-600">{languageData.IdentityVerificationSuccessfulDescriptionSession}</p>
            </>
          ) : (
            <>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">{languageData.IdentityVerificationSuccessful}</h3>
              <p className="text-gray-600">{languageData.IdentityVerificationSuccessfulDescription}</p>
            </>
          )}
        </div>

        {session ? (
          <Button asChild className="bg-primary hover:bg-primary/90 gap-2 px-6 py-2 text-white" size="lg">
            <Link href={getBaseLink("explore")}>
              <LogIn className="mr-2 h-5 w-5" />
              {languageData.Explore}
            </Link>
          </Button>
        ) : (
          <Button asChild className="bg-primary hover:bg-primary/90 gap-2 px-6 py-2 text-white" size="lg">
            <Link href={getBaseLink("register")}>
              <LogIn className="mr-2 h-5 w-5" />
              {languageData.Register}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
