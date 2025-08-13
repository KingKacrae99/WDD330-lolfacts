import { Storage } from './storage.mjs';

/********************************************************
 *   User Interface
 ********************************************************/
export default class UI {
  constructor(){
    this.card = document.getElementById('card');
    this.cardInner = document.getElementById('card-inner');
    this.skeleton = document.getElementById('skeleton');

    this.factText = document.getElementById('fact-text');
    this.factMeta = document.getElementById('fact-meta');
    this.jokeText = document.getElementById('joke-text');
    this.jokeMeta = document.getElementById('joke-meta');

    this.favList = document.getElementById('favorites');
    this.search = document.getElementById('search');

    this.statFacts = document.getElementById('stat-facts');
    this.statJokes = document.getElementById('stat-jokes');
    this.statShares = document.getElementById('stat-shares');

    this.currentItem = null;

    this.renderFavorites();
    this.renderStats();
    this.applyTheme(Storage.getSettings().theme);
  }

  showSkeleton(on){ this.skeleton.classList.toggle('hidden', !on); }

  flipTo(backSide){ // backSide=true => joke
    this.card.classList.toggle('flip', !!backSide);
  }

  setItem(item){
    this.currentItem = item;
    if(item.type==='fact'){
      this.factText.textContent = item.text;
      this.factMeta.textContent = item.source ? `Source: ${item.source}` : '';
      this.flipTo(false);
    }else{
      this.jokeText.textContent = item.text;
      const flags = item.flags ? Object.keys(item.flags).filter(k => item.flags[k]).join(', ') : 'none';
      this.jokeMeta.textContent = `Category: ${item.category} · Flags: ${flags}`;
      this.flipTo(true);
    }
  }

  saveCurrent(){
    if(!this.currentItem) return;
    const favs = Storage.getFavs();
    if (favs.some(f => f.id === this.currentItem.id)) return;
    favs.unshift(this.currentItem);
    Storage.setFavs(favs);
    this.renderFavorites();
  }

  /****************************************************
   *  Remove saved favorite function
   ****************************************************/
  removeFavorite(id){
    const favs = Storage.getFavs().filter(f => f.id !== id);
    Storage.setFavs(favs);
    this.renderFavorites();
  }

  /***************************************
   * Display favorite 
   ***************************************/
  renderFavorites(filterText=''){
    const favs = Storage.getFavs();
    const q = filterText.trim().toLowerCase();
    const out = favs
      .filter(f => !q || f.text.toLowerCase().includes(q))
      .map(f => `
        <li>
          <span class="mini">${this.escape(f.text)}</span>
          <span>
            <button class="btn outline" data-view="${f.id}">View</button>
            <button class="btn secondary" data-del="${f.id}">Drop</button>
          </span>
        </li>`).join('');
    this.favList.innerHTML = out || '<li class="mini">No saved items</li>';
  }

  /******************************************
   * Display Stats Method 
   ******************************************/
  renderStats(){
    const s = Storage.getStats();
    this.statFacts.textContent = s.facts;
    this.statJokes.textContent = s.jokes;
    this.statShares.textContent = s.shares;
  }
  
  incStat(key){
    const s = Storage.getStats();
    s[key] = (s[key]||0) + 1;
    Storage.setStats(s); this.renderStats();
  }

  applyTheme(mode){
    document.body.classList.toggle('dark', mode === 'dark');
    const set = Storage.getSettings();
    Storage.setSettings({ ...set, theme: mode });
  }

  escape(str){ return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
}
