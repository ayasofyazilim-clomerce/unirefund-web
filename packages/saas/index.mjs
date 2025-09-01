import {default as SDKGenerator} from "@ayasofyazilim/sdk_generator";
import {Command, Option} from "commander";
import API_LIST from "./API_LIST.json" with {type: "json"};
import PKG from "./package.json" with {type: "json"};

const program = new Command();

const filterChoices = API_LIST.map((x) => x.output);

program
  .name(PKG.name)
  .description("CLI to generate typescript api clients for " + PKG.name)
  .version(PKG.version);

program
  .requiredOption("-u, --url <string>", "Webgateway url")
  .addOption(new Option("-f, --filter <filter>", "Output name to filter.").choices(filterChoices));
program.parse();
const options = program.opts();
let filteredApiList = API_LIST;
if (options.filter) {
  filteredApiList = API_LIST.filter((x) => x.output === program.opts().filter);
}

await SDKGenerator.generateApi({
  api_list: filteredApiList,
  base_url: options.url,
  webgateway_port: "",
});
