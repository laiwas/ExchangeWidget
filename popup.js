document.getElementById('convert').addEventListener('click', async () => {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const amount = document.getElementById('amount').value.trim();

  const resElem = document.getElementById('result');
  resElem.textContent = '⏳ Загрузка...';

  try {
    const resp = await fetch('https://exchange-widget-five.vercel.app/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, amount })
    });

    const data = await resp.json();

    if (data.ok) {
      resElem.textContent = `✅ ${amount} ${from} = ${data.result} ${to}`;
    } else {
      resElem.textContent = `⚠️ Ошибка: ${JSON.stringify(data)}`;
    }
  } catch (e) {
    resElem.textContent = `❌ ${e.message}`;
  }
});
