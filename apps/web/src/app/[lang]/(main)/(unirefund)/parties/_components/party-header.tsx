import {ExternalLink} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";

export default function PartyHeader({
  name,
  parentId,
  link,
  lang,
}: {
  name?: string | null | undefined;
  parentId?: string | null | undefined;
  link?: string | null | undefined;
  lang?: string | null | undefined;
}) {
  if (!name) return null;
  return (
    <div className="text mb-2 flex h-9 items-center border-b pb-2 font-bold">
      {name}
      {parentId && link && lang ? (
        <Link className="ml-2 text-blue-600" href={getBaseLink(link, lang)}>
          <ExternalLink className="w-4" />
        </Link>
      ) : null}
    </div>
  );
}
