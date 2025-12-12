document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('predict-form');
  const resultCard = document.getElementById('result');
  const predicted = document.getElementById('predicted');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isin = document.getElementById('isin').value;
    const start_date = document.getElementById('start_date').value || '2025-01-01';
    const end_date = document.getElementById('end_date').value || new Date().toISOString().slice(0,10);

    predicted.textContent = 'Loading...';
    resultCard.classList.remove('hidden');

    try {
      const resp = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isin, start_date, end_date })
      });

      if (!resp.ok) {
        const err = await resp.json();
        predicted.textContent = `Error: ${err.detail || resp.statusText}`;
        return;
      }

      const data = await resp.json();
      predicted.textContent = `Predicted next-day high for ${data.isin}: ${data.predicted_high} (confidence: ${data.confidence})`;
    } catch (err) {
      predicted.textContent = `Request failed: ${err.message}`;
    }
  });
});
