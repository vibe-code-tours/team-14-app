import { Card, CardContent } from "@/src/components/Card";

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  sublabel?: string;
}

export function StatsCard({ icon, label, value, sublabel }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {sublabel && (
            <p className="text-xs text-slate-400 mt-0.5">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
