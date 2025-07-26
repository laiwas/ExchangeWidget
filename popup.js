// ID твоей таблицы и имя листа
const SHEET_ID = '2PACX-1vTcdY9DUXxK6csWjoLNS_pW9-E3SP-DsVeiZ3QlKTgkZhOnuuNuZBnpWCTZMlvkqX5AF-0wolAJdD-U';
const SHEET_NAME = 'Exchange'; // подставь своё
const RESULT_CELL_ROW = 1; // индекс строки (A2 = row 1, т.к. первая строка = 0)
const RESULT_CELL_COL = 3; // индекс колонки (D = 3)

// Кнопка "Конвертировать"
document.getElementById('convert').addEventListener('click', async () => {
  const amount = document.getElementById('amount').value.trim();
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;

  if (!amount || isNaN(amount)) {
    document.getElementById('result').innerText = 'Введите сумму';
    return;
  }

  try {
    // ⚡ тут можно ещё дописать логику для записи в таблицу (A2, B2, C2),
    // но сейчас просто читаем готовый результат (например, из D2)

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const res = await fetch(url);
    const text = await res.text();

    // Google отдаёт JSON с префиксом "/*O_o*/\ngoogle.visualization.Query.setResponse("
    const json = JSON.parse(text.substr(47).slice(0, -2));

    const value = json.table.rows[RESULT_CELL_ROW].c[RESULT_CELL_COL].v;
    document.getElementById('result').innerText =
      `${amount} ${from} = ${value} ${to}`;
  } catch (err) {
    console.error('Ошибка чтения из таблицы:', err);
    document.getElementById('result').innerText = 'Ошибка чтения из таблицы';
  }
});