import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Play } from "lucide-react";

// 模拟数据
const exercises = [
  {
    id: 1,
    name: "卧推",
    description: "主要锻炼胸大肌、三角肌前束和肱三头肌",
    category: "胸部",
    videoUrl: "https://example.com/bench-press.mp4",
  },
  {
    id: 2,
    name: "深蹲",
    description: "主要锻炼股四头肌、臀大肌和核心肌群",
    category: "腿部",
    videoUrl: "https://example.com/squat.mp4",
  },
  {
    id: 3,
    name: "硬拉",
    description: "主要锻炼背阔肌、腘绳肌和核心肌群",
    category: "背部",
    videoUrl: "https://example.com/deadlift.mp4",
  },
  {
    id: 4,
    name: "引体向上",
    description: "主要锻炼背阔肌、肱二头肌和肩部肌群",
    category: "背部",
    videoUrl: "https://example.com/pull-up.mp4",
  },
  {
    id: 5,
    name: "肩推",
    description: "主要锻炼三角肌前束和中束",
    category: "肩部",
    videoUrl: "https://example.com/shoulder-press.mp4",
  },
  {
    id: 6,
    name: "二头弯举",
    description: "主要锻炼肱二头肌",
    category: "手臂",
    videoUrl: "https://example.com/bicep-curl.mp4",
  },
];

const workoutPlan = [
  {
    day: "周一",
    focus: "胸部 + 三头肌",
    exercises: [
      { name: "卧推", sets: 4, reps: 12, weight: 60 },
      { name: "哑铃飞鸟", sets: 3, reps: 15, weight: 15 },
      { name: "俯卧撑", sets: 3, reps: 20, weight: 0 },
      { name: "三头肌下压", sets: 3, reps: 15, weight: 30 },
    ],
  },
  {
    day: "周二",
    focus: "背部 + 二头肌",
    exercises: [
      { name: "硬拉", sets: 4, reps: 8, weight: 80 },
      { name: "引体向上", sets: 3, reps: 10, weight: 0 },
      { name: "划船", sets: 3, reps: 12, weight: 40 },
      { name: "二头弯举", sets: 3, reps: 15, weight: 20 },
    ],
  },
  {
    day: "周三",
    focus: "腿部",
    exercises: [
      { name: "深蹲", sets: 4, reps: 10, weight: 70 },
      { name: "腿举", sets: 3, reps: 12, weight: 100 },
      { name: "腿弯举", sets: 3, reps: 15, weight: 30 },
      { name: "小腿提踵", sets: 4, reps: 20, weight: 40 },
    ],
  },
  {
    day: "周四",
    focus: "肩部 + 核心",
    exercises: [
      { name: "肩推", sets: 4, reps: 12, weight: 30 },
      { name: "侧平举", sets: 3, reps: 15, weight: 10 },
      { name: "前平举", sets: 3, reps: 15, weight: 10 },
      { name: "平板支撑", sets: 3, reps: 60, weight: 0 },
    ],
  },
  {
    day: "周五",
    focus: "全身训练",
    exercises: [
      { name: "卧推", sets: 3, reps: 10, weight: 50 },
      { name: "深蹲", sets: 3, reps: 10, weight: 60 },
      { name: "硬拉", sets: 3, reps: 8, weight: 70 },
      { name: "肩推", sets: 3, reps: 10, weight: 25 },
    ],
  },
];

const FitnessPlan = () => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  
  const categories = ["全部", "胸部", "背部", "腿部", "肩部", "手臂"];
  
  const filteredExercises = selectedCategory === "全部"
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 计划创建 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">创建计划</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">健身目标</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>减脂增肌</option>
              <option>增肌</option>
              <option>减脂</option>
              <option>维持</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">训练频率</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>每周3次</option>
              <option>每周4次</option>
              <option>每周5次</option>
              <option>每周6次</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">训练时长</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>30分钟</option>
              <option>45分钟</option>
              <option>60分钟</option>
              <option>90分钟</option>
            </select>
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            生成计划
          </button>
        </div>
      </div>

      {/* 训练安排 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">训练安排</h2>
        <div className="space-y-2">
          {workoutPlan.map((workout, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedDay(expandedDay === index ? null : index)}
              >
                <div>
                  <h3 className="font-medium text-gray-800">{workout.day}</h3>
                  <p className="text-sm text-gray-600">{workout.focus}</p>
                </div>
                {expandedDay === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedDay === index && (
                <div className="p-3 border-t border-gray-200">
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                          <p className="text-sm text-gray-600">
                            {exercise.sets} 组 × {exercise.reps} 次 {exercise.weight > 0 ? `× ${exercise.weight} kg` : ''}
                          </p>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 动作库 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">动作库</h2>
        <div className="flex overflow-x-auto space-x-2 mb-4 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-white bg-blue-500 rounded-full" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{exercise.category}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exercise.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FitnessPlan;