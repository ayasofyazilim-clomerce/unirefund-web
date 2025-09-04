import PassportAuthPage from "../../components/passport-auth-page";

export default function RegisterWithPassportPage({params}: {params: {lang: string}}) {
  return <PassportAuthPage authType="register" params={params} />;
}
