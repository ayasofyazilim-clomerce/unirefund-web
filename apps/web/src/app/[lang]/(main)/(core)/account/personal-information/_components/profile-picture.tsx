import type {AccountServiceResource} from "src/language-data/core/AccountService";

export default function ProfilePicture({languageData}: {languageData: AccountServiceResource}) {
  return <div>{languageData["Profile.Picture"]}</div>;
}
