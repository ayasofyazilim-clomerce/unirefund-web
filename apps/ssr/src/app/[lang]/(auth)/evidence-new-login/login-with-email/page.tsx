import EmailAuthPage from "../../components/email-auth-page";

export default function LoginWithEmailPage({params}: {params: {lang: string}}) {
  return <EmailAuthPage authType="login" params={params} />;
}
