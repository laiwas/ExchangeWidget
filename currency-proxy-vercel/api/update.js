import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from, to, amount } = req.body;

  try {
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Записываем входные данные
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Exchange!A2:C2', // твой лист и диапазон
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[from, to, amount]]
      }
    });

    // 2. Читаем результат из D2 (где стоит формула)
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Exchange!D2' // там должен быть результат
    });

    const result = readRes.data.values ? readRes.data.values[0][0] : null;

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('Sheets API error:', err);
    return res.status(500).json({ error: 'Failed to process' });
  }
}