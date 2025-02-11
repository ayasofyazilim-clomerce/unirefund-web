# Server side sayfa yapısı bu şekilde olmalı.

```
"use client";

import {useRouter} from "next/navigation";
import {useTransition} from "react";

export function Page() {
  const { lang, contractId, partyId, partyName } = useParams<{
    lang: string;
    partyId: string;
    contractId: string;
    partyName: "merchants";
  }>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit()   {
    startTransition(() => {
      void postUserApi({
        requestBody: formData,
      }).then((res) => {
        handlePostResponse(res, router);
      });
    });
  }
  return <div></div>
}
```
