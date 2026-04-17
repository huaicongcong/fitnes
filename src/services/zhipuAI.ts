export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function isZhipuConfigured(): boolean {
  const apiKey = import.meta.env.VITE_ZHIPU_API_KEY;
  return !!apiKey && apiKey !== 'your_api_key_here';
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_ZHIPU_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('请先配置智谱AI API密钥！');
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
    }

    const result: ChatResponse = await response.json();

    if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content;
    }

    throw new Error('AI回复格式错误');
  } catch (error) {
    console.error('智谱AI调用失败:', error);
    throw error;
  }
}
