# Server side sayfa yapısı bu şekilde olmalı.

```
export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
    contractId: string;
    partyName: "merchants";
  };
}) {
  const { lang, contractId, partyId, partyName } = params;
  return <div></div>
}
```

# Client side sayfa yapısı bu şekilde olmalı.

```
export function Page() {
  const { lang, contractId, partyId, partyName } = useParams<{
    lang: string;
    partyId: string;
    contractId: string;
    partyName: "merchants";
  }>();

  return <div></div>
}
```

# Serverside api istekleri bu şekilde olmalı.

```
const securityLogResponse = await getSecurityLogsApi(searchParams);
if(isErrorOnRequest(securityLogResponse,lang)) return;
```

# Client side api istekleri bu şekilde olmalı.

```
setLoading(true);
void postRequest(formData).then((response) => {
    handlePostResponse(response, router);
}).finally(() => {
    setLoading(false);
});
```

# Sayfaların klasör yapısı.

```
|
├── _components
|   |
│   ├── component-name.tsx
│   ├── form.tsx
│   ├── table.tsx
│   ├── table-data.tsx
│   └── types.ts
|
├── client.tsx(client-side)
│
├── layout.tsx
|
└── page.tsx(server-side)
```
