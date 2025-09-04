import PassportAuthPage from "../../components/passport-auth-page";

export default function LoginWithPassportPage({params}: {params: {lang: string}}) {
  return <PassportAuthPage authType="login" params={params} />;
}
