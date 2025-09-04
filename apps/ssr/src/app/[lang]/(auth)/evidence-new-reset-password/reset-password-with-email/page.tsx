import EmailAuthPage from "../../components/email-auth-page";

export default function ResetPasswordWithEmailPage({params}: {params: {lang: string}}) {
  return <EmailAuthPage authType="reset-password" params={params} />;
}
