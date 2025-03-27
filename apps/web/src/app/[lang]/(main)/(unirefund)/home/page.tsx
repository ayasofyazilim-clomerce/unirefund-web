// import Charts from "./charts";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./dashboard"), {
  ssr: false,
});
export default function Page() {
  return <Dashboard />;
}
