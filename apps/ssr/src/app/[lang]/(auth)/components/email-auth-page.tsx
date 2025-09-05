import {
  getTenantByNameApi,
  signInServerApi,
  signUpServerApi,
  sendPasswordResetCodeApi,
} from "@repo/actions/core/AccountService/actions";
import LoginForm from "@repo/ui/theme/auth/login";
import RegisterForm from "@repo/ui/theme/auth/register";
import ResetPasswordForm from "@repo/ui/theme/auth/reset-password";
import Image from "next/image";
import Link from "next/link";
import {IdCard, UserPlus, User, type LucideIcon} from "lucide-react";
import {getResourceData} from "src/language-data/core/AccountService";
import unirefundLogo from "public/unirefund-logo.png";
import {getBaseLink} from "@/utils";

interface EmailAuthPageProps {
  params: {
    lang: string;
  };
  authType: "login" | "register" | "reset-password";
}

export default async function EmailAuthPage({params, authType}: EmailAuthPageProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";

  const isLogin = authType === "login";
  const isRegister = authType === "register";

  // Dinamik path'ler ve linkler
  let passportPath: string;
  let altEmailPath: string;
  let passportLinkText: string;
  let altLinkText: string;
  let altIcon: LucideIcon;

  if (isLogin) {
    passportPath = "login-with-passport";
    altEmailPath = "/evidence-new-register/register-with-email";
    passportLinkText = languageData["Evidence.PassportButton"];
    altLinkText = languageData["Auth.NotMember"];
    altIcon = UserPlus;
  } else if (isRegister) {
    passportPath = "register-with-passport";
    altEmailPath = "/evidence-new-login/login-with-email";
    passportLinkText = languageData["Auth.RegisterWithPassport"];
    altLinkText = languageData["Auth.Member"];
    altIcon = User;
  } else {
    passportPath = "reset-password-with-passport";
    altEmailPath = "/evidence-new-login/login-with-email";
    passportLinkText = languageData["Evidence.ResetPassport"];
    altLinkText = languageData["Auth.Member"];
    altIcon = User;
  }

  const AltIcon = altIcon;

  const fromText = "from";

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
          {fromText}
          <span className="text-xl font-semibold">{languageData["Common.UniRefundCompanyName"]}</span>
        </h3>
      </div>
      <div className="relative flex flex-col items-center justify-center">
        {(() => {
          if (isLogin) {
            return (
              <LoginForm
                isTenantDisabled={isTenantDisabled}
                isVisible={false}
                languageData={languageData}
                onSubmitAction={signInServerApi}
                onTenantSearchAction={getTenantByNameApi}
                passwordLink={getBaseLink("evidence-new-reset-password/reset-password-with-email", lang)}
              />
            );
          }
          if (isRegister) {
            return (
              <RegisterForm
                isTenantDisabled={isTenantDisabled}
                isVisible={false}
                languageData={languageData}
                onSubmitAction={signUpServerApi}
                onTenantSearchAction={getTenantByNameApi}
              />
            );
          }
          return (
            <ResetPasswordForm
              isTenantDisabled={isTenantDisabled}
              isVisible={false}
              languageData={languageData}
              onSubmitAction={sendPasswordResetCodeApi}
              onTenantSearchAction={getTenantByNameApi}
            />
          );
        })()}

        <Link className="hover:text-primary flex items-center gap-2 text-sm text-gray-600" href={passportPath}>
          <IdCard className="ml-1 inline h-4 w-4" />
          {passportLinkText}
        </Link>
        <hr className="my-2 w-3/4 border-t border-gray-200" />

        <Link className="hover:text-primary flex items-center gap-2 text-sm text-gray-600" href={altEmailPath}>
          <AltIcon className="ml-1 inline h-4 w-4" />
          {altLinkText}
        </Link>
      </div>
    </div>
  );
}
