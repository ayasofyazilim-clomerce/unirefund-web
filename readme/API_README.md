# Server Side Api Requests

- Aynı paremetrelerle yapılan tüm istekler aksini belirtilmedikçe önbelleğe alınıyor.
- Kullanıcı token'ının kullanıldığı isteklerde, token değiştikçe güncel sonuçlar gelmeye devam ediyor. Token değişmedikçe veriyi önbellekten alıyor.

Önbellekten gelmeyi belirli bir süreyle sınırlamak ya da kapatmak için [revalidate](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#time-based-revalidation) kullanılmalı.

```ts
// revalidate kullanabilmek için sayfanın başına use server yazılmamış olması gerekiyor.
// use client yazılmadığı sürece next.js server component olarak davrandığı için bu bir sorun teşkil etmiyor.
// sayfayı server side olarak kullanmaya devam edebiliyoruz.

// Eğer 0 verilirse önbelleğe almadan her zaman güncel veriyi getirir.
export const revalidate = 0;

// Matematiksel işlemler yazılmamalı:
// export const revalidate = 60 * 60;
```

Her dakika önbelleği sıfırlayan bir örnek:

```ts
import { getProjectServiceClient } from "src/lib";
export const revalidate = 60;

export default async function Page() {
  const client = await getProjectServiceClient();
  const projects = await client.project.getApiProjectServiceProjects();
  return <>{projects.items[0].definition}</>;
}
```

Önbellekten gelmeyi tamamen engellemek için next.js'in [unstable_noStore](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)'u da kullanılabilir.

```ts
"use server";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page() {
    noStore();
    ...
}
```

Güncel veriyi önbelleğe almadan getiren bir örnek:

```ts
"use server";
import { getProjectServiceClient } from "src/lib";
import { unstable_noStore as noStore } from "next/cache";

export default async function Page() {
  noStore();
  const client = await getProjectServiceClient();
  const projects = await client.project.getApiProjectServiceProjects();
  return <>{projects.items[0].definition}</>;
}
```
