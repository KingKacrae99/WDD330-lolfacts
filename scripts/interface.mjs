export default class UI {
  constructor() {
    this.factTextEl = document.getElementById('fact-text');
    this.factMetaEl = document.getElementById('fact-meta');
    this.favoritesListEl = document.getElementById('favorites-list');
    this.currentFact = null;
    this.storageKey = 'lolfacts_favs';
    this.loadFavorites();
  }

  showFact(fact) {
    this.currentFact = fact;
    this.factTextEl.textContent = fact.text;
    if (fact.source) {
      this.factMetaEl.innerHTML = `<small>Source: <a href="${fact.permalink || '#'}" target="_blank" rel="noopener">${fact.source}</a></small>`;
    } else {
      this.factMetaEl.textContent = '';
    }
  }

  showError(msg) {
    this.factTextEl.textContent = msg;
    this.factMetaEl.textContent = '';
  }

  saveCurrentFact() {
    if (!this.currentFact) return;
    const favs = this._getFavs();
    // prevent duplicates by id or text
    if (favs.some(f => f.id === this.currentFact.id || f.text === this.currentFact.text)) return;
    favs.unshift(this.currentFact);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this.renderFavorites();
  }

  removeFavorite(id) {
    const favs = this._getFavs().filter(f => f.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
    this.renderFavorites();
  }

  _getFavs() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) { return []; }
  }

  loadFavorites() { this.renderFavorites(); }

  renderFavorites() {
    const favs = this._getFavs();
    this.favoritesListEl.innerHTML = favs.length
      ? favs.map(f => `
        <li class="favorite-item">
          <span class="fav-text">${escapeHtml(f.text).slice(0,80)}${f.text.length>80?'…':''}</span>
          <div>
            <button class="btn btn-outline" data-action="view" data-id="${f.id}">View</button>
            <button class="btn btn-secondary" data-action="remove" data-id="${f.id}">Del</button>
          </div>
        </li>`).join('')
      : `<li style="color:#666">No saved facts yet</li>`;
  }
}

/* small helper to avoid HTML injection when showing previews */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
