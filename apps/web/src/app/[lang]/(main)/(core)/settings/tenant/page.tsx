import {RedirectType, permanentRedirect} from "next/navigation";
import {getBaseLink} from "src/utils";

export default function Page({params}: {params: {lang: string}}) {
  permanentRedirect(getBaseLink("settings/tenant/home", params.lang), RedirectType.push);
}
