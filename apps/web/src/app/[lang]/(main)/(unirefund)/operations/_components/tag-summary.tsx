import {Card, CardContent, CardTitle} from "@/components/ui/card";

export function TagSummary({
  title,
  value,
  icon,
  textColor,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  textColor?: string;
}) {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="m-auto flex flex-wrap justify-between p-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon ? icon : <div className={`font-bold ${textColor}`}>{value}</div>}
      </CardContent>
      {icon ? (
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      ) : null}
    </Card>
  );
}
