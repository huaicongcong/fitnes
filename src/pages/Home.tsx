import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { Activity, Dumbbell, Sparkles, Target, Flame, Brain, AlertCircle, CheckCircle2, Timer, Moon, Apple, Utensils, Beef, Coffee, X, Camera, ImagePlus, Droplets, Share2 } from "lucide-react";
import { recognizeFood, isAPConfigured } from "../services/baiduAI";
import { chat, isZhipuConfigured, ChatMessage } from "../services/zhipuAI";
import { parseFoodInput, matchFoods, FoodItem } from "../services/foodDatabase";
import { api, FoodRecord前端 } from "../services/api";

const weeklyPlan = [
  {
    day: "周一",
    dayIndex: 1,
    focus: "练胸",
    muscle: "胸大肌",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    warmup: [
      { name: "沉肩", reps: "保持" },
      { name: "L外旋", reps: "20次 × 2组" },
      { name: "招财猫", reps: "20次 × 2组" },
    ],
    exercises: [
      { name: "固定坐姿器械推胸", sets: 6, reps: "8-12次" },
      { name: "固定平板推胸器", sets: 6, reps: "8-12次" },
      { name: "哑铃推胸", sets: 6, reps: "8-12次" },
      { name: "哑铃上斜凳推胸", sets: 6, reps: "8-12次" },
      { name: "平板杠铃卧推", sets: 6, reps: "8-12次" },
      { name: "史密斯平板卧推", sets: 6, reps: "8-12次" },
      { name: "龙门架夹上胸", sets: 6, reps: "8-12次" },
      { name: "龙门架夹下胸", sets: 6, reps: "8-12次" },
      { name: "龙门架夹中胸", sets: 6, reps: "8-12次" },
    ],
    tip: "推胸时注意沉肩夹背，保持核心稳定",
  },
  {
    day: "周二",
    dayIndex: 2,
    focus: "练背",
    muscle: "背阔肌",
    color: "#3B82F6",
    gradient: "from-blue-500 to-indigo-600",
    warmup: [
      { name: "沉肩", reps: "保持" },
      { name: "L外旋", reps: "20次 × 2组" },
      { name: "招财猫", reps: "20次 × 2组" },
      { name: "擦玻璃", reps: "20次 × 2组" },
    ],
    exercises: [
      { name: "悍马机下拉", sets: 6, reps: "8-12次", weight: "50kg" },
      { name: "高位下拉正手", sets: 6, reps: "8-12次", weight: "55kg" },
      { name: "高位下拉反手", sets: 6, reps: "8-12次", weight: "55kg" },
      { name: "辅助引体向上", sets: 6, reps: "8-12次" },
      { name: "坐姿固定器械划船", sets: 6, reps: "8-12次", weight: "50kg" },
      { name: "俯身单臂哑铃划船", sets: 6, reps: "8-12次", weight: "17.5kg" },
      { name: "坐姿划船", sets: 6, reps: "8-12次" },
      { name: "龙门架直臂下拉", sets: 6, reps: "8-12次" },
    ],
    tip: "划船时背部发力，手臂只是传递工具",
  },
  {
    day: "周三",
    dayIndex: 3,
    focus: "练肩",
    muscle: "三角肌",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
    warmup: [
      { name: "弹力带肩环绕", reps: "15次 × 2组" },
      { name: "L外旋", reps: "15次 × 2组" },
      { name: "招财猫", reps: "15次 × 2组" },
      { name: "站墙W热身", reps: "15次 × 2组" },
    ],
    exercises: [
      { name: "史密斯推肩", sets: 2, reps: "10次" },
      { name: "固定器械推肩", sets: 4, reps: "10次" },
      { name: "固定器械侧平举", sets: 4, reps: "15次" },
      { name: "哑铃推肩", sets: 4, reps: "10次" },
      { name: "哑铃侧平举", sets: 4, reps: "8次" },
      { name: "哑铃俯身飞鸟", sets: 4, reps: "8次" },
      { name: "龙门架单臂侧平举", sets: 4, reps: "8次" },
    ],
    tip: "下周开始全部做3组，然后增加次数",
  },
  {
    day: "周四",
    dayIndex: 4,
    focus: "练臂",
    muscle: "肱二头肌+肱三头肌",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
    warmup: [
      { name: "激活手臂肌肉", reps: "5分钟" },
    ],
    exercises: [
      { name: "哑铃二头弯举", sets: 4, reps: "8-12次" },
      { name: "哑铃锤举", sets: 4, reps: "8-12次" },
      { name: "反握哑铃弯举", sets: 4, reps: "8-12次" },
      { name: "哑铃颈后臂屈伸", sets: 4, reps: "8-12次" },
      { name: "龙门架二头弯举", sets: 4, reps: "8-12次" },
      { name: "龙门架反握弯举", sets: 4, reps: "8-12次" },
      { name: "龙门架绳索锤式弯举", sets: 4, reps: "8-12次" },
      { name: "龙门架绳索下压", sets: 4, reps: "8-12次" },
    ],
    tip: "也可选择休息一天，让肌肉恢复",
  },
  {
    day: "周五",
    dayIndex: 5,
    focus: "练腿",
    muscle: "股四头肌+臀大肌",
    color: "#10B981",
    gradient: "from-emerald-500 to-green-600",
    warmup: [
      { name: "热身动作", reps: "10分钟" },
    ],
    exercises: [
      { name: "哑铃深蹲", sets: 4, reps: "10次" },
      { name: "史密斯杠铃深蹲", sets: 4, reps: "10次" },
      { name: "坐姿腿屈伸", sets: 4, reps: "10次" },
      { name: "坐姿髋外展", sets: 4, reps: "10次" },
      { name: "坐姿髋内收", sets: 4, reps: "10次" },
    ],
    tip: "刚开始每个动作做一组即可，循序渐进",
  },
];

const aiAnalysisRules = {
  protein: {
    low: { threshold: 1.2, message: "蛋白质摄入严重不足，增肌期建议每天摄入1.6-2.2g/kg体重", color: "#EF4444", icon: Beef },
    medium: { threshold: 1.6, message: "蛋白质摄入偏低，建议多吃鸡胸肉、鱼类、蛋类补充优质蛋白", color: "#F59E0B", icon: AlertCircle },
    optimal: { threshold: 2.5, message: "蛋白质摄入合理，继续保持！", color: "#10B981", icon: CheckCircle2 },
  },
  calories: {
    deficit: { threshold: -300, message: "热量摄入偏低，可能影响训练状态和肌肉恢复", color: "#F59E0B", icon: AlertCircle },
    optimal: { threshold: 300, message: "热量摄入合理，有利于达成健身目标", color: "#10B981", icon: CheckCircle2 },
    excess: { threshold: Infinity, message: "热量摄入偏高，注意控制碳水化合物摄入", color: "#EF4444", icon: AlertCircle },
  },
};

const dietPlan = [
  { meal: "早餐", time: "07:30-08:30", icon: "🌅", color: "emerald", food: "鸡蛋 x3 + 燕麦粥 + 牛奶", calories: 450, protein: 28 },
  { meal: "午餐", time: "12:00-13:00", icon: "☀️", color: "amber", food: "鸡胸肉 200g + 糙米 + 蔬菜", calories: 550, protein: 45 },
  { meal: "训练后", time: "17:30-18:00", icon: "🏋️", color: "rose", food: "康比特蛋白粉 1勺 + 香蕉 + Foryes肌酸 5g", calories: 250, protein: 22 },
  { meal: "晚餐", time: "19:30-20:30", icon: "🌙", color: "violet", food: "三文鱼/牛肉 + 红薯/蔬菜", calories: 500, protein: 40 },
];

const Home = () => {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showShareReport, setShowShareReport] = useState(false);
  const [inclineMinutes, setInclineMinutes] = useState(() => {
    const saved = localStorage.getItem('inclineMinutes');
    return saved ? parseInt(saved) : 0;
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<{ name: string; calories: number; protein: number; carbs: number; fat: number } | null>(null);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const [allFoodRecords, setAllFoodRecords] = useState<Record<string, FoodRecord前端[]>>({});
  const [foodRecordsLoaded, setFoodRecordsLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('inclineMinutes', String(inclineMinutes));
  }, [inclineMinutes]);

  useEffect(() => {
    const loadFoodRecords = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const records = await api.food.getRange(startDate, today);
        setAllFoodRecords(records);
      } catch (err) {
        console.error('加载食品记录失败:', err);
      } finally {
        setFoodRecordsLoaded(true);
      }
    };
    loadFoodRecords();
  }, []);

  const [allExerciseRecords, setAllExerciseRecords] = useState<Record<string, string[]>>({});
  const [allWaterRecords, setAllWaterRecords] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const loadAllRecords = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const [waterData, exerciseData] = await Promise.all([
          api.water.getRange(startDate, today),
          api.exercise.getByDate(today)
        ]);
        const waterGrouped: Record<string, string[]> = {};
        waterData.forEach(r => {
          if (!waterGrouped[r.date]) waterGrouped[r.date] = [];
          if (r.hour) waterGrouped[r.date].push(r.hour);
        });
        setAllWaterRecords(waterGrouped);
        const exerciseCompleted: string[] = [];
        const weightsMap: Record<string, string> = {};
        exerciseData.forEach(ex => {
          if (ex.completed) exerciseCompleted.push(ex.exercise_name);
          if (ex.weight > 0) weightsMap[ex.exercise_name] = String(ex.weight);
        });
        setAllExerciseRecords({ ...allExerciseRecords, [today]: exerciseCompleted });
        setExerciseWeights(weightsMap);
      } catch (err) {
        console.error('加载记录失败:', err);
      }
    };
    loadAllRecords();
  }, []);

  const todayKey = getTodayKey();
  const todayRecords = allFoodRecords[todayKey] || [];

  useEffect(() => {
    localStorage.setItem('allExerciseRecords', JSON.stringify(allExerciseRecords));
  }, [allExerciseRecords]);

  const completedExercises = new Set(allExerciseRecords[todayKey] || []);
  const completedWater = new Set(allWaterRecords[todayKey] || []);
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('exerciseWeights');
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('exerciseWeightsDate');
    if (saved && savedDate === today) {
      return JSON.parse(saved);
    }
    return {};
  });
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [tempWeight, setTempWeight] = useState("");

  useEffect(() => {
    localStorage.setItem('exerciseWeights', JSON.stringify(exerciseWeights));
    localStorage.setItem('exerciseWeightsDate', new Date().toISOString().split('T')[0]);
  }, [exerciseWeights]);

  const [newFoodName, setNewFoodName] = useState("");
  const [showAddFood, setShowAddFood] = useState(false);
  const [suggestedFoods, setSuggestedFoods] = useState<FoodItem[]>([]);
  const waterHourly = [
    { hour: "07:00", amount: 420, label: "起床后" },
    { hour: "09:00", amount: 420, label: "上午" },
    { hour: "12:00", amount: 420, label: "午餐前" },
    { hour: "15:00", amount: 420, label: "下午" },
    { hour: "18:00", amount: 420, label: "训练后" },
    { hour: "21:00", amount: 420, label: "睡前" },
  ];
  const waterIntake = completedWater.size * 420;
  const [, setIsAnalyzing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const currentDayIndex = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const todayWorkout = weeklyPlan.find(p => p.dayIndex === currentDayIndex);
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const currentDayName = weekDays[currentDayIndex];

  const userInfo = { weight: 75, height: 176, age: 28, gender: 'male', activityLevel: 1.55, goal: '减脂增肌' };

  const calculateDailyGoals = () => {
    const bmr = userInfo.gender === 'male' ? 88.362 + (13.397 * userInfo.weight) + (4.799 * userInfo.height) - (5.677 * userInfo.age) : 447.593 + (9.247 * userInfo.weight) + (3.098 * userInfo.height) - (4.330 * userInfo.age);
    const tdee = bmr * userInfo.activityLevel;
    const targetCalories = userInfo.goal === '减脂' ? tdee - 500 : userInfo.goal === '增肌' ? tdee + 300 : tdee;
    const targetProtein = userInfo.weight * 2.0;
    const proteinCalories = targetProtein * 4;
    const remainingCalories = targetCalories - proteinCalories;
    const carbsCalories = remainingCalories * 0.8;
    const fatCalories = remainingCalories * 0.2;
    return { calories: Math.round(targetCalories), protein: Math.round(targetProtein), carbs: Math.round(carbsCalories / 4), fat: Math.round(fatCalories / 9) };
  };

  const calculateTodayIntake = () => todayRecords.reduce((acc, food) => ({ calories: acc.calories + (food.calories || 0), protein: acc.protein + (food.protein || 0), carbs: acc.carbs + (food.carbs || 0), fat: acc.fat + (food.fat || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const calculateWorkoutCalories = () => {
    if (!todayWorkout || completedExercises.size === 0) return 0;
    const bodyWeight = parseFloat(String(userInfo.weight)) || 75;
    let totalMinutes = 0;
    let totalWeightedMET = 0;
    completedExercises.forEach(exName => {
      const ex = todayWorkout.exercises.find(e => e.name === exName);
      const sets = parseInt(String(ex?.sets)) || 4;
      const repsMatch = String(ex?.reps).match(/(\d+)/);
      const reps = repsMatch ? parseInt(repsMatch[1]) : 10;
      const workSeconds = sets * reps * 4;
      const restSeconds = sets * 60;
      const exerciseMinutes = (workSeconds + restSeconds) / 60;
      totalMinutes += exerciseMinutes;
      const exNameLower = exName.toLowerCase();
      let met = 5;
      if (exNameLower.includes('蹲') || exNameLower.includes('硬拉') || exNameLower.includes('腿') || exNameLower.includes('臀')) {
        met = 7;
      } else if (exNameLower.includes('卧推') || exNameLower.includes('飞鸟') || exNameLower.includes('胸') || exNameLower.includes('划船') || exNameLower.includes('下拉') || exNameLower.includes('背')) {
        met = 6;
      } else if (exNameLower.includes('肩') || exNameLower.includes('推肩')) {
        met = 5.5;
      } else if (exNameLower.includes('弯举') || exNameLower.includes('臂屈伸') || exNameLower.includes('二头') || exNameLower.includes('三头')) {
        met = 4;
      }
      const liftedWeight = exerciseWeights[exName] ? parseFloat(exerciseWeights[exName]) : 0;
      const weightCoef = liftedWeight > 0 ? (liftedWeight / 100) * 0.4 : 0;
      const effectiveMET = met * (1 + weightCoef);
      totalWeightedMET += effectiveMET * exerciseMinutes;
    });
    const avgWeightedMET = totalWeightedMET / totalMinutes;
    const calories = totalMinutes * avgWeightedMET * bodyWeight / 60;
    return Math.round(calories);
  };

  const calculateInclineCalories = () => {
    const weight = parseFloat(String(userInfo.weight)) || 75;
    const inclineMET = 5;
    const inclineCal = inclineMinutes * inclineMET * weight / 60;
    return Math.round(inclineCal);
  };

  const dailyGoals = calculateDailyGoals();
  const todayIntake = calculateTodayIntake();
  const workoutCalories = calculateWorkoutCalories();
  const inclineCalories = calculateInclineCalories();
  const totalBurnedCalories = workoutCalories + inclineCalories;
  const proteinPerKg = todayIntake.protein / userInfo.weight;

  const getProteinStatus = () => {
    if (proteinPerKg < aiAnalysisRules.protein.low.threshold) return aiAnalysisRules.protein.low;
    if (proteinPerKg < aiAnalysisRules.protein.medium.threshold) return aiAnalysisRules.protein.medium;
    return aiAnalysisRules.protein.optimal;
  };

  const getCaloriesStatus = () => {
    const diff = todayIntake.calories - dailyGoals.calories;
    if (diff < aiAnalysisRules.calories.deficit.threshold) return aiAnalysisRules.calories.deficit;
    if (diff > aiAnalysisRules.calories.excess.threshold) return aiAnalysisRules.calories.excess;
    return aiAnalysisRules.calories.optimal;
  };

  const analyzeWithAI = async () => {
    if (!isZhipuConfigured()) {
      setIsAnalyzing(true);
      setAiMessage("");
      setTimeout(() => {
        const proteinStatus = getProteinStatus();
        const caloriesStatus = getCaloriesStatus();

        let analysis = `📊 AI 健身分析报告\n\n`;
        analysis += `⏰ ${currentDayName} ${todayWorkout?.focus || "休息日"}\n\n`;
        analysis += `💪 今日训练：\n`;
        if (todayWorkout) {
          analysis += `已完成：${completedExercises.size}/${todayWorkout.exercises.length} 个动作\n`;
          analysis += `💡 ${todayWorkout.tip}\n\n`;
        } else {
          analysis += `今日是休息日，让肌肉充分恢复！\n\n`;
        }

        analysis += `🥗 饮食分析：\n`;
        analysis += `• 蛋白质：${todayIntake.protein}g (${proteinPerKg.toFixed(1)}g/kg) - ${proteinStatus.message}\n`;
        analysis += `• 热量：${todayIntake.calories}/${dailyGoals.calories}kcal - ${caloriesStatus.message}\n`;

        if (todayWorkout) {
          const recommendedProtein = Math.round(userInfo.weight * 2.2);
          const proteinGap = recommendedProtein - todayIntake.protein;
          if (proteinGap > 0) {
            analysis += `\n🔥 增肌建议：今日还需补充约${proteinGap}g蛋白质\n`;
            analysis += `推荐：鸡胸肉(31g/100g)、鸡蛋(13g/个)、三文鱼(25g/100g)\n`;
          }
        }

        setAiMessage(analysis);
        setIsAnalyzing(false);
        setShowAIModal(true);
      }, 1500);
      return;
    }

    setIsAnalyzing(true);
    setAiMessage("正在调用AI分析...");
    setShowAIModal(true);

    try {
      const proteinStatus = getProteinStatus();
      const caloriesStatus = getCaloriesStatus();
      const recommendedProtein = Math.round(userInfo.weight * 2.2);

      const systemPrompt = `你是一位专业的健身教练，擅长分析用户的训练计划和饮食情况，给出个性化的增肌建议。请用简洁、有条理的中文回复，使用emoji增加可读性。`;

      const userPrompt = `请分析以下健身数据：

📅 日期：${new Date().toLocaleDateString('zh-CN')}
⏰ 星期：${currentDayName}
🏋️ 训练：${todayWorkout?.focus || "休息日"}
💪 目标肌群：${todayWorkout?.muscle || "-"}
✅ 已完成动作：${completedExercises.size}/${todayWorkout?.exercises.length || 0}个
${todayWorkout ? `📝 训练提示：${todayWorkout.tip}` : ''}

🥗 今日饮食：
• 摄入热量：${todayIntake.calories} / ${dailyGoals.calories} kcal
• 蛋白质：${todayIntake.protein}g / ${recommendedProtein}g (${proteinPerKg.toFixed(1)}g/kg体重)
• 碳水：${todayIntake.carbs}g / ${dailyGoals.carbs}g
• 脂肪：${todayIntake.fat}g / ${dailyGoals.fat}g

🔥 训练消耗：
• 力量训练：${workoutCalories} kcal
• 爬坡：${inclineMinutes}分钟 (${inclineCalories} kcal)
• 总消耗：${totalBurnedCalories} kcal

⚖️ 热量状态：${caloriesStatus.message}
🥩 蛋白质状态：${proteinStatus.message}

请给出：
1. 今日训练状态评价
2. 饮食调整建议（如果需要）
3. 训练后营养补充建议
4. 下一个训练日的准备建议`;

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const response = await chat(messages);
      setAiMessage(response);
    } catch (error) {
      console.error('AI分析失败:', error);
      setAiMessage(`AI分析失败，请检查网络连接或API配置。\n\n错误信息：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveExerciseWeights = async (weightsMap?: Record<string, string>, completedSet?: Set<string>) => {
    if (!todayWorkout) return;
    try {
      const exercises = todayWorkout.exercises.map(ex => ({
        exercise_name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: parseFloat((weightsMap || exerciseWeights)[ex.name]) || 0,
        muscle_group: todayWorkout.muscle,
        completed: (completedSet || completedExercises).has(ex.name) ? 1 : 0
      }));
      await api.exercise.saveDaily(todayKey, exercises, totalBurnedCalories, inclineMinutes);
    } catch (err) {
      console.error('保存训练数据失败:', err);
    }
  };

  const toggleExercise = async (name: string) => {
    const todayExercises = allExerciseRecords[todayKey] || [];
    let newExercises: string[];
    if (todayExercises.includes(name)) {
      newExercises = todayExercises.filter(e => e !== name);
    } else {
      newExercises = [...todayExercises, name];
    }
    const newCompletedSet = new Set(newExercises);
    setAllExerciseRecords({ ...allExerciseRecords, [todayKey]: newExercises });
    try {
      await api.exercise.toggleCompleted(todayKey, name);
      await saveExerciseWeights(undefined, newCompletedSet);
    } catch (err) {
      console.error('同步运动状态失败:', err);
    }
  };

  const removeFoodRecord = async (id: number) => {
    try {
      await api.food.delete(id);
      const todayFoods = allFoodRecords[todayKey] || [];
      setAllFoodRecords({ ...allFoodRecords, [todayKey]: todayFoods.filter(food => food.id !== id) });
    } catch (err) {
      console.error('删除食品记录失败:', err);
    }
  };

  const addFoodRecord = async (food: FoodItem) => {
    const newFood: FoodRecord前端 = {
      id: Date.now(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType: "记录",
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    try {
      const created = await api.food.create(newFood);
      const todayFoods = allFoodRecords[todayKey] || [];
      setAllFoodRecords({ ...allFoodRecords, [todayKey]: [...todayFoods, created] });
      setNewFoodName("");
      setSuggestedFoods([]);
      setShowAddFood(false);
    } catch (err) {
      console.error('添加食品记录失败:', err);
    }
  };

  const handleFoodInput = (input: string) => {
    setNewFoodName(input);
    if (input.length >= 1) {
      setSuggestedFoods(matchFoods(input));
    } else {
      setSuggestedFoods([]);
    }
  };

  const shareRef = useRef<HTMLDivElement>(null);

  const handleShareScreenshot = async () => {
    if (!shareRef.current) return;
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `健身记录-${new Date().toISOString().split('T')[0]}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error('截图失败:', err);
    }
  };

  const renderAIBadge = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowShareReport(true)}
        className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg transition-all hover:scale-105"
        title="健身报告"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleShareScreenshot}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all hover:scale-105"
        title="截图分享"
      >
        <Camera className="w-4 h-4" />
      </button>
      <div className="relative">
        <button
          onClick={analyzeWithAI}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
        >
          <Brain className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">AI 分析</span>
        </button>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
      </div>
    </div>
  );

  const renderProgressRing = (value: number, max: number, size: number = 120, stroke: number = 8, color: string = "#3B82F6") => {
    const radius = (size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(value / max, 1) * circumference;
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
    );
  };

  return (
    <div ref={shareRef} className="space-y-6 pb-20">
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-violet-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">AI 健身助手</h3>
              </div>
              <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{aiMessage}</pre>
            </div>
            <button onClick={() => setShowAIModal(false)} className="mt-4 w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
              关闭
            </button>
          </div>
        </div>
      )}

      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">拍照分析食物</h3>
              </div>
              <button onClick={() => { setShowCameraModal(false); setCapturedImage(null); setAnalyzedResult(null); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-8 text-center border-2 border-dashed border-gray-600">
                  <ImagePlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-4">上传食物照片，AI将分析营养成分</p>
                  <label className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors">
                    选择图片
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setCapturedImage(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
              </div>
            ) : analyzingImage ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={capturedImage} alt="食物照片" className="w-full h-64 object-contain bg-gray-900 rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-10 h-10 text-emerald-400 mx-auto mb-2 animate-pulse" />
                      <p className="text-white font-medium">AI 分析中...</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : analyzedResult ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={capturedImage} alt="食物照片" className="w-full h-48 object-contain bg-gray-900 rounded-xl" />
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium text-emerald-400">分析完成</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">食物名称</p>
                      <p className="font-bold text-white">{analyzedResult.name}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">热量</p>
                      <p className="font-bold text-amber-400">{analyzedResult.calories} kcal</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">蛋白质</p>
                      <p className="font-bold text-red-400">{analyzedResult.protein}g</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">碳水</p>
                      <p className="font-bold text-blue-400">{analyzedResult.carbs}g</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center col-span-2">
                      <p className="text-xs text-gray-400">脂肪</p>
                      <p className="font-bold text-yellow-400">{analyzedResult.fat}g</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newFood = {
                      id: Date.now(),
                      name: analyzedResult.name,
                      calories: analyzedResult.calories,
                      protein: analyzedResult.protein,
                      carbs: analyzedResult.carbs,
                      fat: analyzedResult.fat,
                      mealType: "午餐",
                      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
                    };
                    const todayFoods = allFoodRecords[todayKey] || [];
                    setAllFoodRecords({ ...allFoodRecords, [todayKey]: [...todayFoods, newFood] });
                    setShowCameraModal(false);
                    setCapturedImage(null);
                    setAnalyzedResult(null);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                >
                  添加到今日饮食
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={capturedImage} alt="食物照片" className="w-full h-64 object-contain bg-gray-900 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCapturedImage(null)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">
                    重新选择
                  </button>
                  <button
                    onClick={async () => {
                      if (!isAPConfigured()) {
                        alert('请先配置百度API密钥！');
                        return;
                      }
                      setAnalyzingImage(true);
                      try {
                        const base64Data = capturedImage!.split(',')[1];
                        const result = await recognizeFood(base64Data);
                        setAnalyzedResult({
                          name: result.name,
                          calories: result.calories,
                          protein: result.protein,
                          carbs: result.carbs,
                          fat: result.fat,
                        });
                      } catch {
                        alert('识别失败，请重试！');
                        setCapturedImage(null);
                      }
                      setAnalyzingImage(false);
                    }}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                  >
                    AI 分析
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showShareReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">健身报告</h3>
              </div>
              <button onClick={() => setShowShareReport(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className={`bg-gradient-to-br ${todayWorkout?.gradient || 'from-gray-700 to-gray-800'} rounded-xl p-4 text-white`}>
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentDayName}</p>
                  <p className="text-lg opacity-90">{todayWorkout?.focus || '休息日'}</p>
                  <p className="text-sm opacity-70 mt-1">目标肌群：{todayWorkout?.muscle || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">训练动作</p>
                  <p className="text-xl font-bold text-white">{completedExercises.size}/{todayWorkout?.exercises.length || 0}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">训练消耗</p>
                  <p className="text-xl font-bold text-orange-400">{totalBurnedCalories} kcal</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">摄入热量</p>
                  <p className="text-xl font-bold text-amber-400">{todayIntake.calories} kcal</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">蛋白质</p>
                  <p className="text-xl font-bold text-red-400">{todayIntake.protein}g</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2">完成动作</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(completedExercises).map(exName => (
                    <span key={exName} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">{exName}</span>
                  ))}
                  {completedExercises.size === 0 && <span className="text-gray-500 text-xs">暂无</span>}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-2">今日摄入</p>
                <div className="flex flex-wrap gap-2">
                  {todayRecords.slice(0, 6).map(food => (
                    <span key={food.id} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">{food.name}</span>
                  ))}
                  {todayRecords.length === 0 && <span className="text-gray-500 text-xs">暂无</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const reportText = `🏋️ ${currentDayName} ${todayWorkout?.focus || '健身'}\n\n📊 训练完成：${completedExercises.size}/${todayWorkout?.exercises.length || 0} 个动作\n🔥 消耗：${totalBurnedCalories} kcal\n🥗 摄入：${todayIntake.calories} kcal | 蛋白质 ${todayIntake.protein}g\n\n#健身打卡 #增肌`;
                navigator.clipboard.writeText(reportText);
                setShowShareReport(false);
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              复制分享文案
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src="/avatar.jpg" alt="头像" className="w-14 h-14 rounded-full object-cover border-2 border-violet-500" />
            <div>
              <p className="text-gray-400 text-sm">淮聪聪的健身计划</p>
              <h1 className="text-xl font-bold text-white mt-0.5">
                {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
              </h1>
            </div>
          </div>
          {renderAIBadge()}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3 mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-white">{userInfo.age}岁</p>
              <p className="text-xs text-gray-400">年龄</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-white">{userInfo.height}cm</p>
              <p className="text-xs text-gray-400">身高</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-white">{userInfo.weight}kg</p>
              <p className="text-xs text-gray-400">体重</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-red-400">135g</p>
              <p className="text-xs text-gray-400">蛋白质</p>
              <p className="text-xs text-gray-500">1.8g/kg</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-blue-400">300g</p>
              <p className="text-xs text-gray-400">碳水</p>
              <p className="text-xs text-gray-500">4.0g/kg</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-amber-400">55g</p>
              <p className="text-xs text-gray-400">脂肪</p>
              <p className="text-xs text-gray-500">0.75g/kg</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {weeklyPlan.map((day) => (
            <button
              key={day.day}
              onClick={() => {}}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                day.dayIndex === currentDayIndex
                  ? `bg-gradient-to-br ${day.gradient} text-white shadow-lg`
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              <p className="text-xs font-medium">{day.day}</p>
              <p className="text-sm font-bold mt-1">{day.focus}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            今日营养摄入
          </h2>
          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            {todayIntake.calories} / {dailyGoals.calories} kcal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="relative flex flex-col items-center">
            <div className="relative">
              {renderProgressRing(todayIntake.protein, dailyGoals.protein, 100, 8, "#EF4444")}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Beef className="w-5 h-5 text-red-400 mb-1" />
                <span className="text-lg font-bold text-white">{todayIntake.protein}g</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">蛋白质</p>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="relative">
              {renderProgressRing(todayIntake.carbs, dailyGoals.carbs, 100, 8, "#3B82F6")}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Apple className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-lg font-bold text-white">{todayIntake.carbs}g</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">碳水</p>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="relative">
              {renderProgressRing(todayIntake.fat, dailyGoals.fat, 100, 8, "#F59E0B")}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-lg font-bold text-white">{todayIntake.fat}g</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">脂肪</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">
              饮食记录
            </h3>
            <button
              onClick={() => setShowAddFood(true)}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium rounded-lg transition-colors"
            >
              + 添加
            </button>
          </div>
          {showAddFood && (
            <div className="mb-4 p-4 bg-gray-800/80 rounded-xl border border-emerald-500/30 space-y-3">
              <input
                type="text"
                value={newFoodName}
                onChange={(e) => handleFoodInput(e.target.value)}
                placeholder="输入食物名称，如：鸡蛋、鸡胸肉..."
                className="w-full px-3 py-2 bg-gray-900/80 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
              {suggestedFoods.length > 0 && (
                <div className="space-y-2">
                  {suggestedFoods.slice(0, 5).map((food, idx) => (
                    <button
                      key={idx}
                      onClick={() => addFoodRecord(food)}
                      className="w-full flex items-center justify-between p-3 bg-gray-900/60 hover:bg-emerald-500/10 border border-gray-700 hover:border-emerald-500/50 rounded-lg transition-all"
                    >
                      <div className="text-left">
                        <p className="text-sm text-white font-medium">{food.name}</p>
                        <p className="text-xs text-gray-400">热量 {food.calories}kcal · 蛋白 {food.protein}g · 碳水 {food.carbs}g · 脂肪 {food.fat}g</p>
                      </div>
                      <span className="text-emerald-400 text-sm">+ 添加</span>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setShowAddFood(false); setNewFoodName(""); setSuggestedFoods([]); }}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg"
              >
                关闭
              </button>
            </div>
          )}
          {todayRecords.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">暂无饮食记录</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {todayRecords.map((food) => (
                <div key={food.id} className="group flex items-start gap-2 p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-lg transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-xs text-emerald-400 font-medium truncate">{food.name}</span>
                      <span className="text-xs font-bold text-amber-400">{food.calories}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{food.time}</span>
                      <span className="text-red-400">{food.protein}g</span>
                      <span className="text-blue-400">{food.carbs}g</span>
                      <span className="text-yellow-400">{food.fat}g</span>
                    </div>
                  </div>
                  <button onClick={() => removeFoodRecord(food.id)} className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              训练消耗
            </h3>
            <span className="text-sm text-orange-400 font-medium cursor-pointer">{totalBurnedCalories}kcal</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {completedExercises.size > 0 ? (
              <>
                {Array.from(completedExercises).map(exName => {
                const ex = todayWorkout?.exercises.find(e => e.name === exName);
                const bodyWeight = parseFloat(String(userInfo.weight)) || 75;
                const sets = parseInt(String(ex?.sets)) || 4;
                const repsMatch = String(ex?.reps).match(/(\d+)/);
                const reps = repsMatch ? parseInt(repsMatch[1]) : 10;
                const workSeconds = sets * reps * 4;
                const restSeconds = sets * 60;
                const exerciseMinutes = (workSeconds + restSeconds) / 60;
                const exNameLower = exName.toLowerCase();
                let met = 5;
                if (exNameLower.includes('蹲') || exNameLower.includes('硬拉') || exNameLower.includes('腿') || exNameLower.includes('臀')) {
                  met = 7;
                } else if (exNameLower.includes('卧推') || exNameLower.includes('飞鸟') || exNameLower.includes('胸') || exNameLower.includes('划船') || exNameLower.includes('下拉') || exNameLower.includes('背')) {
                  met = 6;
                } else if (exNameLower.includes('肩') || exNameLower.includes('推肩')) {
                  met = 5.5;
                } else if (exNameLower.includes('弯举') || exNameLower.includes('臂屈伸') || exNameLower.includes('二头') || exNameLower.includes('三头')) {
                  met = 4;
                }
                const liftedWeight = exerciseWeights[exName] ? parseFloat(exerciseWeights[exName]) : 0;
                const weightCoef = liftedWeight > 0 ? (liftedWeight / 100) * 0.4 : 0;
                const effectiveMET = met * (1 + weightCoef);
                const perExerciseCal = Math.round(exerciseMinutes * effectiveMET * bodyWeight / 60);
                return (
                  <div key={exName} className="flex items-center justify-between p-2 bg-gray-800/40 rounded-lg">
                    <span className="text-xs text-white truncate flex-1">{exName}</span>
                    <span className="text-xs text-orange-400 font-medium ml-2">{perExerciseCal}kcal</span>
                  </div>
                );
              })}
              {inclineMinutes > 0 && (
                <div className="flex items-center justify-between p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <span className="text-xs text-cyan-300 truncate flex-1">爬坡 {inclineMinutes}分钟</span>
                  <span className="text-xs text-cyan-300 font-medium ml-2">{inclineCalories}kcal</span>
                </div>
              )}
              </>
            ) : inclineMinutes > 0 ? (
              <div className="col-span-2 flex items-center justify-between p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <span className="text-xs text-cyan-300 truncate flex-1">爬坡 {inclineMinutes}分钟</span>
                <span className="text-xs text-cyan-300 font-medium ml-2">{inclineCalories}kcal</span>
              </div>
            ) : (
              <div className="col-span-2 text-center py-3 text-gray-500 text-xs">
                暂无训练记录
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              喝水记录
            </h3>
            <span className="text-sm text-blue-400 font-medium cursor-pointer">{waterIntake}ml</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {waterHourly.map((item) => {
              const isCompleted = completedWater.has(item.hour);
              const toggleWater = async () => {
                try {
                  await api.water.toggleHour(todayKey, item.hour, 250);
                  const todayWaters = allWaterRecords[todayKey] || [];
                  let newWaters: string[];
                  if (todayWaters.includes(item.hour)) {
                    newWaters = todayWaters.filter(w => w !== item.hour);
                  } else {
                    newWaters = [...todayWaters, item.hour];
                  }
                  setAllWaterRecords({ ...allWaterRecords, [todayKey]: newWaters });
                } catch (err) {
                  console.error('喝水记录同步失败:', err);
                }
              };
              return (
                <button
                  key={item.hour}
                  onClick={toggleWater}
                  className={`p-2 rounded-lg flex flex-col items-center transition-all text-xs ${
                    isCompleted ? 'bg-blue-500/20 border border-blue-500' : 'bg-gray-800/40 border border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <span className={`font-medium ${isCompleted ? 'text-blue-400' : 'text-white'}`}>{item.hour}</span>
                  <span className={`${isCompleted ? 'text-blue-300' : 'text-gray-500'}`}>{item.label}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-blue-400 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {todayWorkout && (
        <div className={`bg-gradient-to-br ${todayWorkout.gradient} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentDayName} · {todayWorkout.focus}</h2>
                  <p className="text-white/80 text-sm">目标肌群：{todayWorkout.muscle}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">热身准备</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {todayWorkout.warmup.map((w, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs">
                    {w.name} × {w.reps}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 flex items-center justify-between mb-1">
                <span className="text-sm font-medium opacity-80">训练动作 ({completedExercises.size}/{todayWorkout.exercises.length})</span>
              </div>
              {todayWorkout.exercises.map((ex, i) => {
                const isCompleted = completedExercises.has(ex.name);
                const currentWeight = exerciseWeights[ex.name] || ex.weight || "";
                const isEditing = editingWeight === ex.name;
                return (
                  <button
                    key={i}
                    onClick={() => toggleExercise(ex.name)}
                    className={`p-2 rounded-lg border-2 flex flex-col items-center transition-all ${
                      isCompleted ? 'bg-emerald-500/20 border-emerald-500' : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className={`text-xs ${isCompleted ? 'text-emerald-400 line-through' : 'text-white'}`}>{ex.name}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempWeight.replace('kg', '')}
                        onChange={(e) => setTempWeight(e.target.value)}
                        onBlur={() => {
                          const newWeights = { ...exerciseWeights, [ex.name]: tempWeight };
                          setExerciseWeights(newWeights);
                          setEditingWeight(null);
                          saveExerciseWeights(newWeights);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newWeights = { ...exerciseWeights, [ex.name]: tempWeight };
                            setExerciseWeights(newWeights);
                            setEditingWeight(null);
                            saveExerciseWeights(newWeights);
                          }
                        }}
                        className="w-full mt-1 px-1 py-0.5 bg-gray-900 border border-gray-600 rounded text-xs text-center text-white"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWeight(ex.name);
                          setTempWeight(currentWeight);
                        }}
                        className="text-xs opacity-60 mt-1 hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {currentWeight ? `${currentWeight}kg` : '点击设置重量'}
                      </div>
                    )}
                    <span className="text-xs opacity-60">{ex.sets}组 · {ex.reps}</span>
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-1" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 bg-gray-800/30 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">🏃 爬坡时间</span>
                {inclineMinutes > 0 && (
                  <span className="text-xs text-cyan-400">{inclineCalories} kcal</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInclineMinutes(Math.max(0, inclineMinutes - 10))}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors text-lg font-medium"
                >
                  −
                </button>
                <div className="flex-1 bg-gray-900/50 rounded-full px-4 py-2.5 text-center">
                  <span className="text-lg font-bold text-white">{inclineMinutes}</span>
                  <span className="text-xs text-gray-400 ml-1.5">分钟</span>
                </div>
                <button
                  onClick={() => setInclineMinutes(inclineMinutes + 10)}
                  className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!todayWorkout && (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Moon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">今日休息</h2>
              <p className="text-white/80 text-sm">让肌肉充分恢复，明天继续努力！</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-violet-400" />
          AI 智能建议
        </h2>
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border ${
            proteinPerKg >= 1.6 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {proteinPerKg >= 1.6 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${proteinPerKg >= 1.6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  蛋白质摄入 {proteinPerKg >= 1.6 ? '达标' : '偏低'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {proteinPerKg >= 1.6 
                    ? '当前蛋白质摄入有利于肌肉恢复和生长' 
                    : `还需补充约${Math.round(userInfo.weight * 1.8) - todayIntake.protein}g蛋白质`}
                </p>
              </div>
            </div>
          </div>

          {todayWorkout && (
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <div className="flex items-start gap-3">
                <Dumbbell className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-violet-400">今日训练提醒</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {todayWorkout.focus}日，建议训练后30分钟内补充蛋白质，配合适量碳水促进吸收
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;