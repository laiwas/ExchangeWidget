import { google } from 'googleapis';
import fs from 'fs';

const creds = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));

async function test() {
  const auth = new google.auth.JWT(
    creds.client_email,
    null,
    creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId: '1wnEg_P5YIPHKxKr-DwynCQLJiiCK5JUURDiuY6lcaUg',
    range: 'Exchange!A2:C2',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [['USD', 'AMD', '100']]
    }
  });

  console.log('✅ Успешно обновлено!');
}

test().catch(console.error);