import dynamic from "next/dynamic";
import Charts from "./charts";

const Dashboard = dynamic(() => import("./dashboard"), {
  ssr: false,
});

export default function Page() {
  const supersetUrl = process.env.SUPERSET_URL;
  const dashboardId = process.env.SUPERSET_DASHBOARD_ID;

  return (
    <div className="h-full w-full">
      {!supersetUrl || !dashboardId ? <Charts /> : <Dashboard dashboardId={dashboardId} supersetUrl={supersetUrl} />}
    </div>
  );
}
