import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { modelId, userMessage, prevAssistantMessage } = await req.json();

  const headers = {
    Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const url = 'https://api.edenai.run/v2/llm/chat';

  const messages = [
    {
      role: 'user',
      content: userMessage,
    },
  ];

  // If there's a previous assistant message, add it to the conversation history
  if (prevAssistantMessage) {
    messages.unshift({
      role: 'assistant',
      content: prevAssistantMessage,
    });
  }

  const body = JSON.stringify({
    model: modelId,
    messages: messages,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (!result.choices?.length) {
      return NextResponse.json(
        { error: 'Invalid response from AI model' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        role: 'assistant',
        content: result.choices[0].message.content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing AI request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
