import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Search, Clock, Camera } from "lucide-react";

// 模拟数据
const nutritionData = [
  { name: "蛋白质", value: 30, color: "#3B82F6" },
  { name: "碳水化合物", value: 45, color: "#10B981" },
  { name: "脂肪", value: 25, color: "#F59E0B" },
];

const foodRecords = [
  {
    id: 1,
    name: "蛋白质 smoothie",
    calories: 250,
    protein: 20,
    carbs: 15,
    fat: 10,
    mealType: "早餐",
    time: "08:00",
  },
  {
    id: 2,
    name: "全麦面包",
    calories: 120,
    protein: 5,
    carbs: 20,
    fat: 2,
    mealType: "早餐",
    time: "08:15",
  },
];

const recipes = [
  {
    id: 1,
    name: "鸡胸肉沙拉",
    calories: 350,
    protein: 30,
    carbs: 20,
    fat: 15,
    time: 15,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=healthy%20chicken%20salad%20with%20vegetables&image_size=square",
  },
  {
    id: 2,
    name: "三文鱼配蔬菜",
    calories: 400,
    protein: 35,
    carbs: 10,
    fat: 25,
    time: 20,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grilled%20salmon%20with%20steamed%20vegetables&image_size=square",
  },
  {
    id: 3,
    name: "糙米蔬菜碗",
    calories: 300,
    protein: 15,
    carbs: 40,
    fat: 10,
    time: 25,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=healthy%20brown%20rice%20bowl%20with%20vegetables&image_size=square",
  },
  {
    id: 4,
    name: "蛋白质燕麦粥",
    calories: 280,
    protein: 25,
    carbs: 30,
    fat: 8,
    time: 10,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=protein%20oatmeal%20with%20berries&image_size=square",
  },
];

const Nutrition = () => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [mealType, setMealType] = useState("早餐");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [todayRecords, setTodayRecords] = useState([...foodRecords]);

  // 用户基本信息（从个人资料获取）
  const userInfo = {
    weight: 75,
    height: 176,
    age: 30,
    gender: 'male',
    activityLevel: 1.55, // 适度运动
    goal: '减脂增肌'
  };

  // 计算每日目标摄入
  const calculateDailyGoals = () => {
    // 基础代谢率 (BMR) - 哈里斯-本尼迪克特公式
    let bmr;
    if (userInfo.gender === 'male') {
      bmr = 88.362 + (13.397 * userInfo.weight) + (4.799 * userInfo.height) - (5.677 * userInfo.age);
    } else {
      bmr = 447.593 + (9.247 * userInfo.weight) + (3.098 * userInfo.height) - (4.330 * userInfo.age);
    }

    // 每日能量消耗 (TDEE)
    const tdee = bmr * userInfo.activityLevel;

    // 根据目标调整
    let targetCalories;
    if (userInfo.goal === '减脂') {
      targetCalories = tdee - 500;
    } else if (userInfo.goal === '增肌') {
      targetCalories = tdee + 300;
    } else {
      targetCalories = tdee; // 减脂增肌/维持
    }

    // 蛋白质: 1.6-2.2g/kg体重
    const targetProtein = userInfo.weight * 2.0;
    
    // 碳水化合物: 根据剩余热量计算
    const proteinCalories = targetProtein * 4;
    const remainingCalories = targetCalories - proteinCalories;
    
    // 碳水和脂肪按 4:1 分配
    const carbsCalories = remainingCalories * 0.8;
    const fatCalories = remainingCalories * 0.2;
    
    const targetCarbs = carbsCalories / 4;
    const targetFat = fatCalories / 9;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(targetProtein),
      carbs: Math.round(targetCarbs),
      fat: Math.round(targetFat)
    };
  };

  // 计算今日实际摄入
  const calculateTodayIntake = () => {
    return todayRecords.reduce((acc, food) => ({
      calories: acc.calories + (food.calories || 0),
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const dailyGoals = calculateDailyGoals();
  const todayIntake = calculateTodayIntake();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        // 模拟 AI 识别食物
        setTimeout(() => {
          // 这里可以集成实际的食物识别 API
          // 模拟识别结果
          setFoodName("鸡胸肉沙拉");
          setCalories("350");
          setProtein("30");
          setCarbs("20");
          setFat("15");
          setIsProcessing(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const mealTypes = ["早餐", "午餐", "晚餐", "加餐"];

  const handleAddFood = () => {
    const newFood = {
      id: Date.now(),
      name: foodName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      mealType: mealType,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setTodayRecords([...todayRecords, newFood]);
    // 重置表单
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setSelectedImage(null);
  };

  // 摄入对比组件
  const IntakeComparison = () => {
    const nutrients = [
      { name: '卡路里', goal: dailyGoals.calories, actual: todayIntake.calories, unit: 'kcal', color: '#10B981' },
      { name: '蛋白质', goal: dailyGoals.protein, actual: todayIntake.protein, unit: 'g', color: '#3B82F6' },
      { name: '碳水', goal: dailyGoals.carbs, actual: todayIntake.carbs, unit: 'g', color: '#F59E0B' },
      { name: '脂肪', goal: dailyGoals.fat, actual: todayIntake.fat, unit: 'g', color: '#EF4444' },
    ];

    const getStatus = (actual: number, goal: number) => {
      const ratio = actual / goal;
      if (ratio < 0.8) return { text: '吃少了', color: 'text-amber-600 bg-amber-50' };
      if (ratio > 1.2) return { text: '吃多了', color: 'text-red-600 bg-red-50' };
      return { text: '刚好', color: 'text-green-600 bg-green-50' };
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">今日摄入对比</h2>
        <div className="space-y-4">
          {nutrients.map((nutrient) => {
            const ratio = Math.min(nutrient.actual / nutrient.goal, 2);
            const status = getStatus(nutrient.actual, nutrient.goal);
            
            return (
              <div key={nutrient.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">{nutrient.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {nutrient.actual} / {nutrient.goal} {nutrient.unit}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(ratio * 100, 200)}%`,
                      backgroundColor: nutrient.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 摄入对比 */}
      <IntakeComparison />
      
      {/* 饮食记录 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">饮食记录</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索食物"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Camera className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              id="fileInput" 
              accept="image/*" 
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡路里</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">蛋白质 (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">碳水化合物 (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">脂肪 (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">餐别</label>
            <div className="flex space-x-2">
              {mealTypes.map((type) => (
                <button
                  key={type}
                  className={`flex-1 py-2 rounded-lg text-sm ${mealType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setMealType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {/* 图片预览 */}
          {selectedImage && (
            <div className="relative p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">食物图片</h4>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
              </div>
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="食物" 
                  className="w-full h-48 object-cover rounded"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                      <p>正在识别食物...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={handleAddFood}
          >
            添加食物
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-2">今日饮食</h3>
          <div className="space-y-2">
            {todayRecords.map((food) => (
              <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">{food.name}</h4>
                    <span className="ml-2 text-xs text-gray-500">{food.mealType}</span>
                  </div>
                  <p className="text-sm text-gray-600">{food.calories} 卡路里</p>
                </div>
                <span className="text-sm text-gray-500">{food.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 营养分析 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">营养分析</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-medium text-gray-800 mb-3">今日营养摄入</h3>
            <div className="space-y-2">
              {nutritionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>营养建议:</strong> 您的蛋白质摄入略低，建议增加优质蛋白质来源，如鸡胸肉、鱼类或豆类。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 食谱推荐 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">食谱推荐</h2>
        <div className="grid grid-cols-2 gap-3">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200">
                <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800">{recipe.name}</h3>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-600">{recipe.time} 分钟</span>
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-blue-600">{recipe.protein}g 蛋白质</span>
                  <span className="text-green-600">{recipe.carbs}g 碳水</span>
                  <span className="text-amber-600">{recipe.fat}g 脂肪</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                    {recipe.calories} 卡路里
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;