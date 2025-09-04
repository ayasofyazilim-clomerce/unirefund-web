import {getTenantByNameApi, signInServerApi} from "@repo/actions/core/AccountService/actions";
import LoginForm from "@repo/ui/theme/auth/login";
import Image from "next/image";
import Link from "next/link";
import {getResourceData} from "src/language-data/core/AccountService";
import unirefundLogo from "public/unirefund-logo.png";
import {IdCard, UserPlus} from "lucide-react";

export default async function LoginWithEmailPage({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-primary flex flex-col items-center justify-center rounded-t-lg p-4 text-white lg:rounded-l-lg lg:rounded-r-none lg:p-10">
        <Image
          alt={languageData["Common.LoginBannerAlt"]}
          className="bg-primary flex h-32 w-32 rounded-t-lg object-cover lg:h-auto lg:w-full lg:rounded-l-lg lg:rounded-t-none "
          height={9999}
          src={unirefundLogo}
          width={9999}
        />
        <h3 className="flex flex-col items-center text-sm text-white">
          from
          <span className="text-xl font-semibold">{languageData["Common.UniRefundCompanyName"]}</span>
        </h3>
      </div>
      <div className="relative flex flex-col items-center justify-center">
        <LoginForm
          isTenantDisabled={isTenantDisabled}
          isVisible={false}
          languageData={languageData}
          onSubmitAction={signInServerApi}
          onTenantSearchAction={getTenantByNameApi}
        />
        <Link className="hover:text-primary flex items-center gap-2 text-sm text-gray-600" href={`login-with-passport`}>
          <IdCard className="ml-1 inline h-4 w-4" />
          Login with Passport
        </Link>
        <hr className="my-2 w-3/4 border-t border-gray-200" />

        <Link
          className=" hover:text-primary flex  items-center gap-2 text-sm text-gray-600"
          href={`/evidence-new-register/register-with-email`}>
          <UserPlus className="ml-1 inline h-4 w-4" />
          {languageData["Auth.NotMember"]}
        </Link>
      </div>
    </div>
  );
}
