export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
  defaultAmount: number;
  amount?: number;
}

function parseQuantity(input: string): { quantity: number; baseInput: string } {
  const quantityMatch = input.match(/^(\d+(?:\.\d+)?)\s*(ml|l|g|kg|个|根|片|罐|杯|瓶|包|份|勺|粒|只|个半)?/);
  if (quantityMatch) {
    const numStr = quantityMatch[1];
    const unit = quantityMatch[2] || '';
    let quantity = parseFloat(numStr);
    if (unit === '个半') {
      quantity = 1.5;
    }
    const baseInput = input.replace(quantityMatch[0], '').trim();
    return { quantity, baseInput };
  }
  return { quantity: 1, baseInput: input };
}

function getMultiplier(unit: string, quantity: number): number {
  if (unit === 'ml' || unit === 'l') {
    return quantity / 100;
  }
  if (unit === 'g' || unit === 'kg') {
    if (unit === 'kg') {
      quantity = quantity * 1000;
    }
    return quantity / 100;
  }
  return quantity;
}

export const foodDatabase: FoodItem[] = [
  { name: "鸡蛋", calories: 144, protein: 13, carbs: 1, fat: 10, unit: "个", defaultAmount: 1 },
  { name: "鸡胸肉", calories: 133, protein: 31, carbs: 0, fat: 1, unit: "100g", defaultAmount: 100 },
  { name: "牛奶", calories: 54, protein: 3, carbs: 4, fat: 3, unit: "100ml", defaultAmount: 100 },
  { name: "全脂牛奶", calories: 61, protein: 3, carbs: 5, fat: 3, unit: "100ml", defaultAmount: 100 },
  { name: "脱脂牛奶", calories: 34, protein: 3, carbs: 5, fat: 0, unit: "100ml", defaultAmount: 100 },
  { name: "燕麦", calories: 389, protein: 17, carbs: 66, fat: 7, unit: "100g", defaultAmount: 100 },
  { name: "燕麦片", calories: 389, protein: 17, carbs: 66, fat: 7, unit: "100g", defaultAmount: 100 },
  { name: "糙米", calories: 370, protein: 8, carbs: 77, fat: 3, unit: "100g", defaultAmount: 100 },
  { name: "白米", calories: 391, protein: 7, carbs: 86, fat: 1, unit: "100g", defaultAmount: 100 },
  { name: "米饭", calories: 116, protein: 2, carbs: 26, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "鸡腿", calories: 209, protein: 26, carbs: 0, fat: 11, unit: "100g", defaultAmount: 100 },
  { name: "鸡翅", calories: 222, protein: 26, carbs: 0, fat: 13, unit: "100g", defaultAmount: 100 },
  { name: "牛肉", calories: 250, protein: 26, carbs: 0, fat: 15, unit: "100g", defaultAmount: 100 },
  { name: "牛排", calories: 271, protein: 26, carbs: 0, fat: 18, unit: "100g", defaultAmount: 100 },
  { name: "猪肉", calories: 143, protein: 27, carbs: 0, fat: 3, unit: "100g", defaultAmount: 100 },
  { name: "猪排", calories: 271, protein: 26, carbs: 0, fat: 18, unit: "100g", defaultAmount: 100 },
  { name: "三文鱼", calories: 183, protein: 22, carbs: 0, fat: 10, unit: "100g", defaultAmount: 100 },
  { name: "虾", calories: 85, protein: 18, carbs: 1, fat: 1, unit: "100g", defaultAmount: 100 },
  { name: "虾仁", calories: 93, protein: 20, carbs: 0, fat: 2, unit: "100g", defaultAmount: 100 },
  { name: "鱼肉", calories: 90, protein: 18, carbs: 0, fat: 2, unit: "100g", defaultAmount: 100 },
  { name: "豆腐", calories: 81, protein: 8, carbs: 2, fat: 4, unit: "100g", defaultAmount: 100 },
  { name: "豆浆", calories: 33, protein: 3, carbs: 1, fat: 2, unit: "100ml", defaultAmount: 100 },
  { name: "香蕉", calories: 93, protein: 1, carbs: 23, fat: 0, unit: "根", defaultAmount: 1 },
  { name: "苹果", calories: 52, protein: 0, carbs: 14, fat: 0, unit: "个", defaultAmount: 1 },
  { name: "橙子", calories: 47, protein: 1, carbs: 12, fat: 0, unit: "个", defaultAmount: 1 },
  { name: "西兰花", calories: 34, protein: 3, carbs: 5, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "青菜", calories: 14, protein: 1, carbs: 2, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "菠菜", calories: 23, protein: 3, carbs: 4, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "蔬菜", calories: 20, protein: 1, carbs: 4, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "红薯", calories: 86, protein: 1, carbs: 20, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "土豆", calories: 76, protein: 2, carbs: 17, fat: 0, unit: "100g", defaultAmount: 100 },
  { name: "玉米", calories: 112, protein: 4, carbs: 23, fat: 1, unit: "根", defaultAmount: 1 },
  { name: "面包", calories: 265, protein: 9, carbs: 49, fat: 3, unit: "片", defaultAmount: 1 },
  { name: "全麦面包", calories: 247, protein: 13, carbs: 41, fat: 4, unit: "片", defaultAmount: 1 },
  { name: "面条", calories: 350, protein: 12, carbs: 70, fat: 1, unit: "100g", defaultAmount: 100 },
  { name: "馒头", calories: 223, protein: 7, carbs: 47, fat: 1, unit: "个", defaultAmount: 1 },
  { name: "包子", calories: 227, protein: 9, carbs: 31, fat: 8, unit: "个", defaultAmount: 1 },
  { name: "饺子", calories: 242, protein: 12, carbs: 24, fat: 12, unit: "个", defaultAmount: 1 },
  { name: "水饺", calories: 242, protein: 12, carbs: 24, fat: 12, unit: "个", defaultAmount: 1 },
  { name: "披萨", calories: 266, protein: 11, carbs: 33, fat: 10, unit: "片", defaultAmount: 1 },
  { name: "汉堡", calories: 295, protein: 15, carbs: 24, fat: 14, unit: "个", defaultAmount: 1 },
  { name: "薯条", calories: 312, protein: 3, carbs: 41, fat: 15, unit: "份", defaultAmount: 1 },
  { name: "薯片", calories: 548, protein: 7, carbs: 53, fat: 35, unit: "包", defaultAmount: 1 },
  { name: "可乐", calories: 42, protein: 0, carbs: 11, fat: 0, unit: "罐", defaultAmount: 1 },
  { name: "雪碧", calories: 48, protein: 0, carbs: 12, fat: 0, unit: "罐", defaultAmount: 1 },
  { name: "奶茶", calories: 78, protein: 0, carbs: 14, fat: 3, unit: "杯", defaultAmount: 1 },
  { name: "咖啡", calories: 1, protein: 0, carbs: 0, fat: 0, unit: "杯", defaultAmount: 1 },
  { name: "蛋白粉", calories: 120, protein: 24, carbs: 3, fat: 1, unit: "勺", defaultAmount: 1 },
  { name: "康比特", calories: 120, protein: 24, carbs: 3, fat: 1, unit: "勺", defaultAmount: 1 },
  { name: "肌酸", calories: 0, protein: 0, carbs: 0, fat: 0, unit: "份", defaultAmount: 5 },
  { name: "坚果", calories: 607, protein: 20, carbs: 21, fat: 54, unit: "100g", defaultAmount: 100 },
  { name: "杏仁", calories: 579, protein: 21, carbs: 22, fat: 50, unit: "100g", defaultAmount: 100 },
  { name: "花生", calories: 563, protein: 26, carbs: 13, fat: 45, unit: "100g", defaultAmount: 100 },
  { name: "腰果", calories: 553, protein: 18, carbs: 30, fat: 44, unit: "100g", defaultAmount: 100 },
  { name: "酸奶", calories: 72, protein: 3, carbs: 9, fat: 3, unit: "100g", defaultAmount: 100 },
  { name: "希腊酸奶", calories: 97, protein: 9, carbs: 4, fat: 5, unit: "100g", defaultAmount: 100 },
  { name: "奶酪", calories: 402, protein: 25, carbs: 1, fat: 33, unit: "100g", defaultAmount: 100 },
  { name: "芝士", calories: 402, protein: 25, carbs: 1, fat: 33, unit: "100g", defaultAmount: 100 },
  { name: "沙拉", calories: 20, protein: 1, carbs: 3, fat: 0, unit: "份", defaultAmount: 1 },
  { name: "沙拉酱", calories: 443, protein: 1, carbs: 7, fat: 48, unit: "勺", defaultAmount: 1 },
  { name: "米饭团", calories: 200, protein: 4, carbs: 45, fat: 1, unit: "个", defaultAmount: 1 },
  { name: "饭团", calories: 200, protein: 4, carbs: 45, fat: 1, unit: "个", defaultAmount: 1 },
  { name: "三明治", calories: 250, protein: 10, carbs: 30, fat: 10, unit: "个", defaultAmount: 1 },
  { name: "能量棒", calories: 450, protein: 20, carbs: 50, fat: 20, unit: "根", defaultAmount: 1 },
  { name: "运动饮料", calories: 26, protein: 0, carbs: 7, fat: 0, unit: "100ml", defaultAmount: 100 },
  { name: "维生素", calories: 0, protein: 0, carbs: 0, fat: 0, unit: "片", defaultAmount: 1 },
  { name: "鱼油", calories: 10, protein: 0, carbs: 0, fat: 1, unit: "粒", defaultAmount: 1 },
  { name: "蛋黄", calories: 322, protein: 16, carbs: 4, fat: 27, unit: "个", defaultAmount: 1 },
  { name: "蛋白", calories: 52, protein: 11, carbs: 1, fat: 0, unit: "个", defaultAmount: 1 },
  { name: "鸡蛋白", calories: 52, protein: 11, carbs: 1, fat: 0, unit: "个", defaultAmount: 1 },
];

function calculateFoodNutrition(food: FoodItem, quantity: number, unit: string): FoodItem {
  const multiplier = getMultiplier(unit, quantity);

  return {
    ...food,
    amount: quantity,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
  };
}

function getFoodUnit(food: FoodItem): string {
  if (food.unit.includes('100ml') || food.unit === 'ml') return 'ml';
  if (food.unit.includes('100g') || food.unit === 'g' || food.unit === 'kg') return 'g';
  return food.unit;
}

export function parseFoodInput(input: string): FoodItem | null {
  const { quantity, baseInput } = parseQuantity(input);
  const lowerInput = baseInput.toLowerCase();

  for (const food of foodDatabase) {
    if (lowerInput.includes(food.name.toLowerCase())) {
      const unit = getFoodUnit(food);
      return calculateFoodNutrition(food, quantity, unit);
    }
  }

  return null;
}

export function matchFoods(input: string): FoodItem[] {
  const results: FoodItem[] = [];
  const { quantity, baseInput } = parseQuantity(input);
  const lowerInput = baseInput.toLowerCase();

  for (const food of foodDatabase) {
    if (lowerInput.includes(food.name.toLowerCase())) {
      const unit = getFoodUnit(food);
      results.push(calculateFoodNutrition(food, quantity, unit));
    }
  }

  return results;
}
