import { NextResponse } from 'next/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY belum di-set di environment variables' }, { status: 500 });
    }

    const { bookData, marketplace = 'shopee' } = await request.json();

    if (!bookData?.title || bookData.title.trim().length < 5) {
      return NextResponse.json({ error: 'Judul buku minimal 5 karakter' }, { status: 400 });
    }
    if (!bookData?.subject || bookData.subject.trim().length < 2) {
      return NextResponse.json({ error: 'Bidang ilmu wajib diisi' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(marketplace);
    const userPrompt = buildUserPrompt(bookData);

    const requestBody = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      
      let errorDetail = 'API error ' + response.status;
      try {
        const errJson = JSON.parse(errText);
        errorDetail = errJson.error?.message || errText;
      } catch (e) {
        errorDetail = errText;
      }
      
      return NextResponse.json(
        { error: 'Anthropic: ' + errorDetail },
        { status: 502 }
      );
    }

    const data = await response.json();
    const textContent = data.content
      ?.filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    const cleaned = textContent.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json(
      { error: 'Server error: ' + err.message },
      { status: 500 }
    );
  }
}
