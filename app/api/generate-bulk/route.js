import { NextResponse } from 'next/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';

export const maxDuration = 300; // 5 min for bulk

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { books, marketplace = 'shopee' } = await request.json();

    if (!Array.isArray(books) || books.length === 0) {
      return NextResponse.json({ error: 'Data buku kosong' }, { status: 400 });
    }

    if (books.length > 20) {
      return NextResponse.json({ error: 'Maksimal 20 buku per batch' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(marketplace);
    const results = [];

    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      
      if (!book.title || book.title.trim().length < 5) {
        results.push({
          index: i,
          input: book,
          error: `Baris ${i + 1}: Judul minimal 5 karakter`,
        });
        continue;
      }

      if (!book.subject || book.subject.trim().length < 2) {
        results.push({
          index: i,
          input: book,
          error: `Baris ${i + 1}: Bidang ilmu wajib diisi`,
        });
        continue;
      }

      try {
        const userPrompt = buildUserPrompt(book);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          }),
        });

        if (!response.ok) {
          results.push({
            index: i,
            input: book,
            error: `Baris ${i + 1}: API error ${response.status}`,
          });
          continue;
        }

        const data = await response.json();
        const text = data.content
          ?.filter((b) => b.type === 'text')
          .map((b) => b.text)
          .join('');
        const cleaned = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        results.push({ index: i, input: book, result: parsed });
      } catch (err) {
        results.push({
          index: i,
          input: book,
          error: `Baris ${i + 1}: ${err.message}`,
        });
      }

      // Rate limit spacing: 1s between calls
      if (i < books.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('Bulk generate error:', err);
    return NextResponse.json({ error: 'Bulk generation failed' }, { status: 500 });
  }
}
