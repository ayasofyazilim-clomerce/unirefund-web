import EmailAuthPage from "../../components/email-auth-page";

export default function RegisterWithEmailPage({params}: {params: {lang: string}}) {
  return <EmailAuthPage authType="register" params={params} />;
}
