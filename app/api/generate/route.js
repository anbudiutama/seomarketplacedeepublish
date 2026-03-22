import { NextResponse } from 'next/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';

export const maxDuration = 60;

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { bookData, marketplace = 'shopee' } = await request.json();

    // Peningkatan #2: Server-side validation
    if (!bookData?.title || bookData.title.trim().length < 5) {
      return NextResponse.json({ error: 'Judul buku minimal 5 karakter' }, { status: 400 });
    }
    if (!bookData?.subject || bookData.subject.trim().length < 2) {
      return NextResponse.json({ error: 'Bidang ilmu wajib diisi' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(marketplace);
    const userPrompt = buildUserPrompt(bookData);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
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
      { error: 'Gagal menghasilkan konten. Coba lagi.' },
      { status: 500 }
    );
  }
}
