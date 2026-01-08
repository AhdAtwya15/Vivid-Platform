"use client";
import { IDailyView } from "@/interfaces";
import { BarLoader } from "react-spinners";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  Area,
  AreaChart,
  Legend,
} from "recharts";

interface DailyViewsChartProps {
  data: IDailyView[];
  isLoading?: boolean;
  title?: string;
}

interface PayloadItem {
  value: number;
  payload: IDailyView;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-100 dark:bg-emerald-900/40 border-emerald-700/50 rounded-lg p-3 shadow-lg backdrop-blur-sm">
        <p className="font-medium text-emerald-400">{label}</p>
        <p className="text-[#007A55] dark:text-slate-300">Views: <span className="font-semibold">{data.views}</span></p>
        <p className="text-[#007A55] dark:text-slate-300 text-sm">Date: {data.fullDate}</p>
        <p className="text-[#007A55] dark:text-slate-300 text-sm">Day: {data.day}</p>
      </div>
    );
  }
  return null;
};

const ViewsChart = ({ data, isLoading, title = "Views Analytics" }: DailyViewsChartProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BarLoader width={"100%"} color="#007A55" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <BarLoader />
      </div>
    );
  }

 
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const averageViews = totalViews / data.length;
  const maxViews = Math.max(...data.map(item => item.views));
  const minViews = Math.min(...data.map(item => item.views));
  
 
  const dates = data.map(item => item.date);
  const dateRange = `${dates[0]} - ${dates[dates.length - 1]}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-emerald-700 dark:text-white">{title}</h3>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-slate-300">
          <span >Total : <span className="font-medium text-emerald-600 dark:text-emerald-70">{totalViews}</span></span>
          <span >Avg : <span className="font-medium text-emerald-600 dark:text-emerald-70">{Math.round(averageViews)}</span></span>
          <span >Range : <span className="font-medium text-emerald-600 dark:text-emerald-70">{dateRange}</span></span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#475569" }}
              tickLine={false}
              domain={[0, "auto"]}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#007A55"
              fill="url(#colorViews)"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "#007A55",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6, stroke: "#007A55", strokeWidth: 2 }}
            />
            <Brush dataKey="day" height={30} stroke="#007A55" />
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007A55" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#007A55" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-100 dark:bg-emerald-900/40 p-3 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-600">Total Views</p>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-100">{totalViews}</p>
        </div>
        <div className="bg-gray-100 dark:bg-emerald-900/40 p-3 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-600">Average</p>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-100">{Math.round(averageViews)}</p>
        </div>
        <div className="bg-gray-100 dark:bg-emerald-900/40 p-3 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-600">Max</p>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-100">{maxViews}</p>
        </div>
        <div className="bg-gray-100 dark:bg-emerald-900/40 p-3 rounded-lg">
          <p className="text-sm text-emerald-700 dark:text-emerald-600">Min</p>
          <p className="text-xl font-bold text-emerald-800 dark:text-emerald-100">{minViews}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewsChart;



