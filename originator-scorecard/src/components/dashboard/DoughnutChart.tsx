import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#1B2A4A', '#00A3A1', '#E85D75', '#F5A623', '#6C5CE7', '#00B894'];

interface DoughnutChartProps {
  title: string;
  data: { name: string; value: number }[];
}

export default function DoughnutChart({ title, data }: DoughnutChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-text-secondary mb-4">{title}</h3>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-sm font-medium text-text-secondary mb-4" style={{ fontFamily: 'var(--font-family-heading)' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number | string | undefined) => `${Number(v ?? 0).toFixed(1)}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
