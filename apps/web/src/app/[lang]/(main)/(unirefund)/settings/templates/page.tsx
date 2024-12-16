import { redirect } from "next/navigation";
import { getBaseLink } from "src/utils";

export default function Page() {
  redirect(getBaseLink("settings/templates/rebate"));
}
