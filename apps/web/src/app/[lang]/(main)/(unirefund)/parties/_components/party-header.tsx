import {ExternalLink} from "lucide-react";
import Link from "next/link";

export default function PartyHeader({
  name,
  parentId,
  link,
}: {
  name?: string | null | undefined;
  parentId?: string | null | undefined;
  link?: string | null | undefined;
}) {
  if (!name) return null;
  return (
    <div className="text mb-2 flex h-9 items-center border-b pb-2 font-bold">
      {name}
      {parentId && link ? (
        <Link className="ml-2 text-blue-600" data-testid="parent-link" href={link}>
          <ExternalLink className="w-4" />
        </Link>
      ) : null}
    </div>
  );
}
