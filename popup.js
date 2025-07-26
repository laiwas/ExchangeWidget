// получаем элементы
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert');
const swapBtn = document.getElementById('swap');
const resultDiv = document.getElementById('result');

// кнопка swap
swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
});

// обработчик клика Convert
convertBtn.addEventListener('click', async () => {
  const from = fromSelect.value.trim();
  const to = toSelect.value.trim();
  const amount = amountInput.value.trim();

  resultDiv.textContent = '⏳ Loading...';

  try {
    const resp = await fetch('https://exchange-widget-five.vercel.app/api/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, amount })
    });
    const data = await resp.json();

    if (data.ok) {
      const valueFromSheet = data.result;
      resultDiv.textContent = `✅ ${amount} ${from} = ${valueFromSheet} ${to}`;
    } else {
      resultDiv.textContent = `⚠️ Error: ${JSON.stringify(data)}`;
    }
  } catch (e) {
    resultDiv.textContent = `❌ ${e.message}`;
  }
});

// ✅ обработчик Enter, добавляется один раз
amountInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    convertBtn.click();
  }
});
