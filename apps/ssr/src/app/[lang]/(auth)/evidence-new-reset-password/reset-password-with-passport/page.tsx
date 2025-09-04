import PassportAuthPage from "../../components/passport-auth-page";

export default function ResetPasswordWithPassportPage({params}: {params: {lang: string}}) {
  return <PassportAuthPage authType="reset-password" params={params} />;
}
