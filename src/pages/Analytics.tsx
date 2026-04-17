import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Award, AlertCircle } from "lucide-react";

// 模拟数据
const workoutData = [
  { date: "周一", duration: 45, calories: 300 },
  { date: "周二", duration: 60, calories: 400 },
  { date: "周三", duration: 0, calories: 0 },
  { date: "周四", duration: 45, calories: 350 },
  { date: "周五", duration: 60, calories: 450 },
  { date: "周六", duration: 90, calories: 600 },
  { date: "周日", duration: 0, calories: 0 },
];

const bodyData = [
  { date: "1月", weight: 78, bodyFat: 22 },
  { date: "2月", weight: 77, bodyFat: 21 },
  { date: "3月", weight: 76, bodyFat: 20 },
  { date: "4月", weight: 75, bodyFat: 19 },
];

const aiSuggestions = [
  {
    id: 1,
    type: "训练",
    title: "增加训练强度",
    description: "您的训练时长稳定，建议逐渐增加重量或组数，以继续提高肌肉质量。",
    priority: "high",
  },
  {
    id: 2,
    type: "饮食",
    title: "调整蛋白质摄入",
    description: "根据您的训练强度，建议增加蛋白质摄入量至每日1.6-2.0g/kg体重。",
    priority: "high",
  },
  {
    id: 3,
    type: "休息",
    title: "确保充分休息",
    description: "建议在高强度训练后安排适当的休息日，促进肌肉恢复。",
    priority: "medium",
  },
  {
    id: 4,
    type: "睡眠",
    title: "改善睡眠质量",
    description: "良好的睡眠对肌肉恢复和脂肪燃烧至关重要，建议每晚保持7-8小时睡眠。",
    priority: "medium",
  },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<string>("周");
  const [selectedMetric, setSelectedMetric] = useState<string>("体重");

  const timeRanges = ["周", "月", "年"];
  const metrics = ["体重", "体脂率"];

  return (
    <div className="space-y-6">
      {/* 健身数据统计 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">健身数据统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">本周训练</p>
            <p className="text-xl font-bold text-blue-600">4 次</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">总训练时长</p>
            <p className="text-xl font-bold text-green-600">300 分钟</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">消耗卡路里</p>
            <p className="text-xl font-bold text-purple-600">2100 kcal</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">平均心率</p>
            <p className="text-xl font-bold text-amber-600">145 BPM</p>
          </div>
        </div>
      </div>

      {/* 训练趋势 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">训练趋势</h2>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTimeRange(range)}
              >
                {range}视图
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="duration" name="训练时长 (分钟)" fill="#3B82F6" />
              <Bar yAxisId="right" dataKey="calories" name="消耗卡路里" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 身体数据 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">身体数据</h2>
          <div className="flex space-x-2">
            {metrics.map((metric) => (
              <button
                key={metric}
                className={`px-3 py-1 rounded-full text-sm ${selectedMetric === metric ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedMetric(metric)}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bodyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={selectedMetric === "体重" ? [70, 80] : [15, 25]} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                formatter={(value) => [selectedMetric === "体重" ? `${value} kg` : `${value}%`, selectedMetric]}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric === "体重" ? "weight" : "bodyFat"} 
                stroke={selectedMetric === "体重" ? "#3B82F6" : "#F59E0B"} 
                strokeWidth={2} 
                dot={{ r: 4, fill: selectedMetric === "体重" ? "#3B82F6" : "#F59E0B" }} 
                activeDot={{ r: 6, fill: selectedMetric === "体重" ? "#1D4ED8" : "#D97706" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI 建议 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">AI 建议</h2>
        <div className="space-y-3">
          {aiSuggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className={`p-3 rounded-lg ${suggestion.priority === "high" ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-3 ${suggestion.priority === "high" ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                  {suggestion.priority === "high" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full mr-2 ${suggestion.priority === "high" ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {suggestion.type}
                    </span>
                    <h3 className="font-medium text-gray-800">{suggestion.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;