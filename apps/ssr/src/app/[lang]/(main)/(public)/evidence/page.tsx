import {redirect} from "next/navigation";
import {getBaseLink} from "@/utils";

export default function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  redirect(getBaseLink("/", lang));
}
