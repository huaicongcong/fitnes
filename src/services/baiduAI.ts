export interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  probability: number;
}

const nutritionDatabase: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  "米饭": { calories: 116, protein: 2.6, carbs: 25.9, fat: 0.3 },
  "面条": { calories: 284, protein: 8.3, carbs: 59.5, fat: 0.8 },
  "馒头": { calories: 223, protein: 7.0, carbs: 47.0, fat: 1.1 },
  "面包": { calories: 265, protein: 8.0, carbs: 50.0, fat: 3.2 },
  "鸡胸肉": { calories: 133, protein: 31.0, carbs: 0.0, fat: 1.2 },
  "鸡腿": { calories: 181, protein: 26.0, carbs: 0.0, fat: 8.0 },
  "鸡蛋": { calories: 144, protein: 13.3, carbs: 1.5, fat: 8.8 },
  "牛肉": { calories: 125, protein: 26.0, carbs: 0.0, fat: 3.0 },
  "猪肉": { calories: 143, protein: 27.0, carbs: 0.0, fat: 3.2 },
  "鱼肉": { calories: 90, protein: 20.0, carbs: 0.0, fat: 1.0 },
  "虾": { calories: 85, protein: 18.0, carbs: 0.5, fat: 0.5 },
  "蔬菜": { calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2 },
  "西兰花": { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
  "白菜": { calories: 17, protein: 1.0, carbs: 3.1, fat: 0.1 },
  "青菜": { calories: 14, protein: 1.5, carbs: 2.0, fat: 0.2 },
  "土豆": { calories: 76, protein: 2.0, carbs: 17.0, fat: 0.1 },
  "红薯": { calories: 99, protein: 1.6, carbs: 23.6, fat: 0.1 },
  "苹果": { calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2 },
  "香蕉": { calories: 93, protein: 1.4, carbs: 22.0, fat: 0.2 },
  "牛奶": { calories: 65, protein: 3.2, carbs: 4.8, fat: 3.3 },
  "酸奶": { calories: 72, protein: 3.0, carbs: 9.0, fat: 2.5 },
  "豆腐": { calories: 81, protein: 8.0, carbs: 2.0, fat: 4.0 },
  "豆浆": { calories: 33, protein: 2.9, carbs: 1.2, fat: 1.6 },
  "沙拉": { calories: 35, protein: 1.5, carbs: 5.0, fat: 1.2 },
  "汉堡": { calories: 295, protein: 15.0, carbs: 30.0, fat: 12.0 },
  "披萨": { calories: 266, protein: 11.0, carbs: 33.0, fat: 10.0 },
  "薯条": { calories: 312, protein: 3.4, carbs: 41.0, fat: 15.0 },
  "炸鸡": { calories: 246, protein: 24.0, carbs: 10.0, fat: 12.0 },
  "炒饭": { calories: 180, protein: 5.0, carbs: 30.0, fat: 5.0 },
  "炒面": { calories: 200, protein: 6.0, carbs: 35.0, fat: 5.0 },
  "饺子": { calories: 242, protein: 12.0, carbs: 30.0, fat: 9.0 },
  "包子": { calories: 227, protein: 8.0, carbs: 35.0, fat: 6.0 },
  "粥": { calories: 46, protein: 1.1, carbs: 9.9, fat: 0.2 },
  "燕麦": { calories: 389, protein: 16.9, carbs: 66.0, fat: 6.9 },
  "坚果": { calories: 600, protein: 20.0, carbs: 15.0, fat: 50.0 },
  "三明治": { calories: 250, protein: 10.0, carbs: 30.0, fat: 10.0 },
  "烤肉": { calories: 200, protein: 25.0, carbs: 2.0, fat: 10.0 },
  "火锅": { calories: 150, protein: 20.0, carbs: 10.0, fat: 5.0 },
  "拉面": { calories: 350, protein: 15.0, carbs: 50.0, fat: 10.0 },
  "咖喱": { calories: 180, protein: 8.0, carbs: 20.0, fat: 8.0 },
  "宫保鸡丁": { calories: 197, protein: 18.0, carbs: 10.0, fat: 10.0 },
  "鱼香肉丝": { calories: 185, protein: 15.0, carbs: 12.0, fat: 9.0 },
  "红烧肉": { calories: 248, protein: 14.0, carbs: 8.0, fat: 18.0 },
  "糖醋里脊": { calories: 220, protein: 18.0, carbs: 20.0, fat: 8.0 },
  "麻婆豆腐": { calories: 135, protein: 8.0, carbs: 8.0, fat: 8.0 },
  "番茄炒蛋": { calories: 120, protein: 10.0, carbs: 8.0, fat: 6.0 },
};

function findBestMatch(foodName: string): { calories: number; protein: number; carbs: number; fat: number } {
  const lowerName = foodName.toLowerCase();

  for (const [key, value] of Object.entries(nutritionDatabase)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }

  return { calories: 150, protein: 10, carbs: 15, fat: 5 };
}

let cachedToken: { token: string; expireTime: number } | null = null;

async function getAccessToken(): Promise<string> {
  const apiKey = import.meta.env.VITE_BAIDU_API_KEY;
  const secretKey = import.meta.env.VITE_BAIDU_SECRET_KEY;

  if (!apiKey || !secretKey || apiKey === 'your_api_key_here') {
    throw new Error('请先配置百度API密钥！');
  }

  if (cachedToken && cachedToken.expireTime > Date.now()) {
    return cachedToken.token;
  }

  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

  const response = await fetch(tokenUrl, { method: 'POST' });
  const data = await response.json();

  if (data.access_token) {
    cachedToken = {
      token: data.access_token,
      expireTime: Date.now() + (data.expires_in - 200) * 1000,
    };
    return cachedToken.token;
  }

  throw new Error(data.error_description || '获取Access Token失败');
}

export async function recognizeFood(imageBase64: string): Promise<FoodResult> {
  const apiKey = import.meta.env.VITE_BAIDU_API_KEY;
  const secretKey = import.meta.env.VITE_BAIDU_SECRET_KEY;

  if (!apiKey || !secretKey || apiKey === 'your_api_key_here') {
    throw new Error('请先配置百度API密钥！');
  }

  try {
    const accessToken = await getAccessToken();
    const apiUrl = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/dish_rpc?access_token=${accessToken}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    const result = await response.json();

    if (result.result && result.result.length > 0) {
      const dish = result.result[0];
      const name = dish.name || '未知食物';
      const nutrition = findBestMatch(name);

      return {
        name,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        probability: dish.probability || 0.8,
      };
    }

    throw new Error('未能识别食物');
  } catch (error) {
    console.error('百度API识别失败:', error);
    throw error;
  }
}

export function isAPConfigured(): boolean {
  const apiKey = import.meta.env.VITE_BAIDU_API_KEY;
  return !!apiKey && apiKey !== 'your_api_key_here';
}