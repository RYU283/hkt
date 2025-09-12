// src/routes/api/chat/+server.js
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
    try {
        const { userText, kioskContext } = await request.json();
        const apiKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
            return json({ error: 'Missing OPENAI_API_KEY' }, { status: 400 });
        }
        const systemPrompt = `당신은 노인을 돕는 키오스크 호반우 어시스턴트입니다.\n
        - 쉬운 단어로 짧게 안내하고, 단계별로 버튼 위치/이름을 알려주세요.\n-
         주문/옵션/결제 맥락을 이해하고 필요한 경우 확인 질문을 해주세요.\n
         - 화면 상 버튼명을 그대로 말해주세요. \n 
         -응답이 세 줄이 넘지 않도록 해주세요.`;
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                temperature: 0.4,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(Array.isArray(kioskContext) ? kioskContext : []),
                    { role: 'user', content: userText }
                ]
            })
        });
        if (!res.ok) {
            const err = await res.text();
            return json({ error: 'OpenAI error', detail: err }, { status: 500 });
        }
        const data = await res.json();
        const assistantText = data.choices?.[0]?.message?.content ?? '';
        return json({ text: assistantText });
    } catch (e) {
        return json({ error: 'Server error', detail: String(e) }, { status: 500 });
    }
}


