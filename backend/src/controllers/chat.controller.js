import { getSupabaseClient } from '../config/supabase.js'

const PROMPT = [
  'You are Xanvoraa AI, the official website assistant for Xanvoraa Technologies in Jabalpur, Madhya Pradesh, India.',
  '',
  'Verified business facts:',
  '- Core services: Web Development, App Development, AI & Automation, WordPress Development, Maintenance & Support, and Custom Software Solutions.',
  '- Public starting prices: landing pages INR 19,999; business websites INR 39,999; e-commerce INR 79,999; custom web applications INR 149,999; mobile apps INR 199,999; hospital or school ERP INR 249,999; AI chatbot and automation INR 49,999; AI voice agents INR 79,999; UI/UX design INR 24,999; maintenance INR 7,999 per month.',
  '- Every final quote depends on scope, features, integrations and timeline.',
  '- Contact and WhatsApp: +91 7067694391.',
  '- Business email: info@xanvoraa.com.',
  '- Address: Right Town, Jabalpur, Madhya Pradesh, India.',
  '',
  'Rules:',
  '- Reply in Hindi or Hinglish when the user writes Hindi or Hinglish; otherwise reply in English.',
  '- Be concise, professional and helpful.',
  '- Use only the verified facts above. Never invent clients, guarantees, discounts, delivery dates or capabilities.',
  '- For exact quotes, ask for requirements and direct the user to the contact form or WhatsApp.',
  '- Do not claim that Xanvoraa provides a service that is not listed above.',
].join('\n')

async function history(sessionId) {
  const { data, error } = await getSupabaseClient()
    .from('chatbot_conversations')
    .select('messages')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (error) throw error
  return Array.isArray(data?.messages) ? data.messages.slice(-20) : []
}

export async function sendChatMessage(request, response) {
  const sessionId =
    typeof request.body.sessionId === 'string' ? request.body.sessionId.trim() : ''
  const message =
    typeof request.body.message === 'string' ? request.body.message.trim() : ''

  if (!sessionId || !message) {
    return response.status(400).json({
      success: false,
      message: 'sessionId and message are required',
    })
  }

  if (sessionId.length > 100 || message.length > 1000) {
    return response.status(400).json({
      success: false,
      message: 'Chat request is too long',
    })
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({
      success: false,
      message: 'Chat service is not configured',
    })
  }

  try {
    let previous = []

    try {
      previous = await history(sessionId)
    } catch (error) {
      console.error('Unable to load chatbot conversation:', error.message)
    }

    const contents = [
      ...previous.map(item => ({
        role: item.role,
        parts: [{ text: item.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT }] },
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 300 },
        }),
        signal: AbortSignal.timeout(15000),
      },
    )

    const data = await geminiResponse.json()

    if (!geminiResponse.ok) {
      return response.status(502).json({
        success: false,
        message: 'Unable to reach the chat service',
      })
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map(item => item.text)
      .filter(Boolean)
      .join('\n')

    if (!reply) {
      return response.status(502).json({
        success: false,
        message: 'The chat service returned an empty response',
      })
    }

    const timestamp = new Date().toISOString()
    const messages = [
      ...previous,
      { role: 'user', content: message, timestamp },
      { role: 'model', content: reply, timestamp },
    ]
    const forwarded = request.headers['x-forwarded-for']
    const userIp = (
      typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : request.ip
    )?.replace(/^::ffff:/, '') || null

    try {
      const { error } = await getSupabaseClient()
        .from('chatbot_conversations')
        .upsert(
          {
            session_id: sessionId,
            messages,
            user_ip: userIp,
            updated_at: timestamp,
          },
          { onConflict: 'session_id' },
        )

      if (error) throw error
    } catch (error) {
      console.error('Unable to save chatbot conversation:', error.message)
    }

    return response.json({ success: true, reply })
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError'
    console.error('Chat request failed:', timedOut ? 'Request timed out' : error.message)
    return response.status(timedOut ? 504 : 500).json({
      success: false,
      message: timedOut ? 'Chat service timed out' : 'Something went wrong',
    })
  }
}