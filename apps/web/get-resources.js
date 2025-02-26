const fs = require("fs");
const path = require("path");

async function getRequestAndWriteToFile() {
  try {
    //AbpApplicationLocalization endpoint linki
    const url = "http://192.168.1.105:44336/api/abp/application-localization?CultureName=en";

    const response = await (await fetch(url)).json();
    const keys = Object.keys(response["resources"]);

    let string = "";
    keys.map((key) => {
      if (!response["resources"]?.[key]?.["texts"]) return;
      if (Object.keys(response["resources"][key].texts).length === 0) return; // Boş type'lar eslint hatası veriyor

      const resources = response["resources"][key]["texts"];
      string += `export type ${key}Resources = {\n`;
      Object.keys(resources).forEach((key) => (string += `\t"${key}": "${resources[key].replaceAll('"', '\\"')}";\n`));
      string += "}\n";
    });

    const filePath = path.join(__dirname, "src/language-data/resources.ts");
    fs.writeFileSync(filePath, string);
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
}

getRequestAndWriteToFile();
