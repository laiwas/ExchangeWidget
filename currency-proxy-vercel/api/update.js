import { google } from 'googleapis';

export default async function handler(req, res) {
  // ✅ CORS-заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ preflight-запрос (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ основной метод
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, amount } = req.body || {};

  try {
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      // важно: приватный ключ в переменных окружения должен быть в кавычках с \n, поэтому заменяем
      process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // ✅ Записываем входные данные
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Exchange!A2:C2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[from, to, amount]]
      }
    });

    // ✅ Читаем результат
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Exchange!D2'
    });

    const result = readRes.data.values ? readRes.data.values[0][0] : null;

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('Sheets API error:', err);
    return res.status(500).json({ error: 'Failed to process' });
  }
}
