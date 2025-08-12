import FactService from './factservice.mjs';
import UI from './interface.mjs';

const ui = new UI();

const getFactBtn = document.getElementById('get-fact-btn');
const newFactBtn = document.getElementById('new-fact-btn');
const saveFactBtn = document.getElementById('save-fact-btn');
const shareFactBtn = document.getElementById('share-fact-btn');
const favoritesList = document.getElementById('favorites-list');

async function loadAndShowFact() {
  ui.showFact({ text: 'Loading…' });
  try {
    const fact = await FactService.getRandomFact();
    ui.showFact(fact);
  } catch (err) {
    ui.showError('Could not load a fact. Try again.');
  }
}

// events
getFactBtn.addEventListener('click', loadAndShowFact);
newFactBtn.addEventListener('click', loadAndShowFact);
saveFactBtn.addEventListener('click', () => ui.saveCurrentFact());

shareFactBtn.addEventListener('click', async () => {
  if (!ui.currentFact) return;
  const text = `${ui.currentFact.text} — from Lolfacts`;
  if (navigator.share) {
    try { await navigator.share({ text, title: 'Lolfacts' }); } catch(e) { /* user cancelled */ }
  } else {
    // fallback copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert('Fact copied to clipboard. Share it!');
    } catch (e) {
      alert('Cannot share on this device.');
    }
  }
});

// delegated favorites buttons
favoritesList.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'view') {
    const favs = JSON.parse(localStorage.getItem('lolfacts_favs') || '[]');
    const fact = favs.find(f => f.id === id);
    if (fact) ui.showFact(fact);
  } else if (action === 'remove') {
    ui.removeFavorite(id);
  }
});


loadAndShowFact();
