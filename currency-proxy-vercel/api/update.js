import { google } from 'googleapis';

export default async function handler(req, res) {
  // Разрешаем CORS (если нужно вызывать с фронта)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Проверка метода
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, amount } = req.body;

  // Проверка параметров
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // Авторизация через сервисный аккаунт
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // Обновляем ячейки A2:C2 (замени Exchange на своё имя листа!)
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Лист1!A2:C2', // << проверь имя листа
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[from, to, amount]]
      }
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Sheets API error:', err);
    return res.status(500).json({ error: 'Failed to update sheet' });
  }
}