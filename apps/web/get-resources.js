const fs = require("fs");
const path = require("path");

async function readEnvironmentVariables() {
  function parseEnv(data) {
    const envObj = {};
    data.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envObj[key.trim()] = value.trim();
      }
    });
    return envObj;
  }

  try {
    const filePath = path.join(__dirname, ".env");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const envVariables = parseEnv(fileContent);

    const data = {
      clientId: envVariables.CLIENT_ID.replaceAll('"', ""),
      clientSecret: envVariables.CLIENT_SECRET.replaceAll('"', ""),
      username: envVariables.ADMIN_USERNAME.replaceAll('"', ""),
      password: envVariables.ADMIN_PASSWORD.replaceAll('"', ""),
      BASE_URL: envVariables.BASE_URL.replaceAll('"', ""),
      TOKEN_URL: envVariables.TOKEN_URL.replaceAll('"', "") + "/connect/token",
      OPENID_URL: envVariables.TOKEN_URL.replaceAll('"', "") + "/.well-known/openid-configuration",
    };
    return data;
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
}
async function getLanguageResources(credentials) {
  try {
    //AbpApplicationLocalization endpoint linki
    const url = credentials.BASE_URL + "/api/abp/application-localization?CultureName=en";

    const response = await (await fetch(url)).json();
    const keys = Object.keys(response["resources"]);

    let string = "";
    keys.map((key) => {
      if (!response["resources"]?.[key]?.["texts"]) return;
      if (Object.keys(response["resources"][key].texts).length === 0) return; // Boş type'lar eslint hatası veriyor

      const resources = response["resources"][key]["texts"];
      string += `export type ${key}Resources = {\n`;
      Object.keys(resources).forEach((key) => (string += `\t"${key}": "${resources[key].replaceAll('"', '\\"')}";\n`));
      string += "};\n";
    });

    const filePath = path.join(__dirname, "src/language-data/resources.ts");
    fs.writeFileSync(filePath, string);
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
}

async function getGrantedPolicies(credentials) {
  async function fetchScopes(OPENID_URL) {
    const scopes = await fetch(OPENID_URL)
      .then((response) => response.json())
      .then((json) => json.scopes_supported.join(" ") || "");
    return scopes;
  }
  async function login(credentials) {
    const scopes = await fetchScopes(credentials.OPENID_URL);
    const urlencoded = new URLSearchParams();
    const urlEncodedContent = {
      grant_type: "password",
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      username: credentials.username,
      password: credentials.password,
      scope: scopes,
    };

    Object.entries(urlEncodedContent).forEach(([key, value]) => urlencoded.append(key, value));
    const response = await fetch(credentials.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: urlencoded,
    });
    return await response.json();
  }
  async function getPolicies(access_token) {
    const response = await fetch(
      credentials.BASE_URL + "/api/abp/application-configuration?IncludeLocalizationResources=false",
      {
        method: "GET",
        headers: {
          accept: "text/plain",
          Authorization: "Bearer " + access_token,

          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
    return response.json();
  }
  try {
    const data = await login(credentials);
    const response = await getPolicies(data.access_token);
    const policies = response.auth.grantedPolicies;

    //make all policies false
    Object.keys(policies).forEach((key) => (policies[key] = false));
    const filePath = path.join(__dirname, "../../packages/utils/policies/policies.json");

    fs.writeFileSync(filePath, JSON.stringify(policies, null, 2));
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
}

async function main() {
  const credentials = await readEnvironmentVariables();
  getGrantedPolicies(credentials);
  getLanguageResources(credentials);
}

main();
