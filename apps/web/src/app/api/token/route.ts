"use server";
const supersetUrl = "http://192.168.1.107:8089";
const supersetApiUrl = `${supersetUrl}/api/v1/security`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dashboardId = url.searchParams.get("dashboardId");
  if (!dashboardId) return new Response("Dashboard id not found", {status: 400});

  const guest_token_response = await getGuestToken(dashboardId);
  if (guest_token_response.status === 200) {
    const guest_token_data = (await guest_token_response.json()) as {token: string};
    return new Response(guest_token_data.token);
  }

  if (guest_token_response.status === 401) {
    const guest_error = (await guest_token_response.json()) as {msg: string};
    if (guest_error.msg === "Token has expired") {
      const new_guest_token_response = await getGuestToken(dashboardId, true); // Re-request with refreshed token
      if (new_guest_token_response.status === 200) {
        const new_guest_token_data = (await new_guest_token_response.json()) as {token: string};
        return new Response(new_guest_token_data.token);
      }
    }
  }

  return guest_token_response;
}

async function getToken(): Promise<string> {
  const login_body = {
    password: "admin",
    provider: "db",
    refresh: true,
    username: "admin",
  };

  const response = await fetch(`${supersetApiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login_body),
  });
  const data = (await response.json()) as {access_token: string};
  const access_token = data.access_token;
  return access_token;
}

async function refreshToken(): Promise<string> {
  const response = await fetch(`${supersetApiUrl}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  const data = (await response.json()) as {access_token: string};
  const access_token = data.access_token;
  return access_token;
}

async function getGuestToken(dashboardId: string, useRefreshToken = false): Promise<Response> {
  const token = useRefreshToken ? await refreshToken() : await getToken();
  const guest_token_body = {
    resources: [
      {
        type: "dashboard",
        id: dashboardId,
      },
    ],
    rls: [],
    user: {
      username: "",
      first_name: "",
      last_name: "",
    },
    exp: "1615136400",
  };
  const guest_token_response = await fetch(`${supersetApiUrl}/guest_token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(guest_token_body),
  });
  return guest_token_response;
}
