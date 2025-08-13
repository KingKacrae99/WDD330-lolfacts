import UI from './interface.mjs';
import { Storage } from './storage.mjs';
import FactService from './factservice.mjs';
import JokeService from './jokeservice.mjs';

const ui = new UI();

/************************
 * Elements
*************************/
const btnNewFact = document.getElementById('btn-new-fact');
const btnSaveFact = document.getElementById('btn-save-fact');
const btnShareFact = document.getElementById('btn-share-fact');

const btnNewJoke = document.getElementById('btn-new-joke');
const btnSaveJoke = document.getElementById('btn-save-joke');
const btnShareJoke = document.getElementById('btn-share-joke');

const jokeCategory = document.getElementById('joke-category');
const themeToggle = document.getElementById('theme-toggle');
const offlineBar = document.getElementById('offline');

const favList = document.getElementById('favorites');
const search = document.getElementById('search');

/************************
 * Loaders
*************************/
async function loadFact(){
  ui.showSkeleton(true);
  try{
    const fact = await FactService.getRandomFact();
    ui.setItem(fact);
    ui.incStat('facts');
  }catch(e){
    ui.setItem({ type:'fact', id:crypto.randomUUID(), text:'Could not load a fact. Try again.', source:'', category:'', flags:null, safe:true, language:'en', fetchedAt:Date.now() });
  }finally{ ui.showSkeleton(false); }
}
async function loadJoke(){
  ui.showSkeleton(true);
  try{
    const cat = Storage.getSettings().category || 'Any';
    const joke = await JokeService.getRandomJoke(cat);
    ui.setItem(joke);
    ui.incStat('jokes');
  }catch(e){
    ui.setItem({ type:'joke', id:crypto.randomUUID(), text:'Could not load a joke. Try again.', source:'', category:'Any', flags:null, safe:true, language:'en', fetchedAt:Date.now() });
  }finally{ ui.showSkeleton(false); }
}

/************************
 * click new fact
*************************/
btnNewFact.addEventListener('click', loadFact);

/************************
 * click save fact 
*************************/
btnSaveFact.addEventListener('click', () => ui.saveCurrent());

/************************
 * click share fact
*************************/
btnShareFact.addEventListener('click', () => shareCurrent());

/************************
 * click new joke
*************************/
btnNewJoke.addEventListener('click', loadJoke);

/************************
 * click save joke
*************************/
btnSaveJoke.addEventListener('click', () => ui.saveCurrent());

/************************
 * click share joke
*************************/
btnShareJoke.addEventListener('click', () => shareCurrent());


/************************
 * change category
*************************/
jokeCategory.addEventListener('change', (e) => {
  const set = Storage.getSettings();
  Storage.setSettings({ ...set, category: e.target.value });
  loadJoke();
});

/***************************
 * input search favorites
***************************/
search.addEventListener('input', (e)=> ui.renderFavorites(e.target.value));

/******************************************
 * delegated favorites actions (view/drop)
*******************************************/
favList.addEventListener('click', (ev)=>{
  const view = ev.target.closest('[data-view]');
  const del = ev.target.closest('[data-del]');
  if (view){
    const id = view.getAttribute('data-view');
    const fav = Storage.getFavs().find(f => f.id === id);
    if (fav) ui.setItem(fav);
  } else if (del){
    const id = del.getAttribute('data-del');
    ui.removeFavorite(id);
  }
});

// theme toggle
themeToggle.addEventListener('change', (e)=>{
  ui.applyTheme(e.target.checked ? 'dark' : 'light');
});

/******************************************************************
* keyboard shortcut: N = new item (toggle between fact/joke sides)
******************************************************************/
document.addEventListener('keydown', (e)=>{
  if (e.key.toLowerCase() === 'n'){
    // alternate
    if (Math.random() < 0.5) loadFact(); else loadJoke();
  }
});

/************************
 * online/offline Event
*************************/
window.addEventListener('online', ()=> offlineBar.classList.add('hidden'));
window.addEventListener('offline', ()=> offlineBar.classList.remove('hidden'));

/********************************************************
 * Share helper function
********************************************************/
async function shareCurrent(){
  if (!ui.currentItem) return;
  const text = `${ui.currentItem.text} — via Lolfacts`;
  const s = Storage.getStats(); s.shares=(s.shares||0)+1; Storage.setStats(s); ui.renderStats();

  if (navigator.share){
    try { await navigator.share({ text, title:'Lolfacts' }); } catch(e) {}
  }else{
    try{ await navigator.clipboard.writeText(text); alert('Copied to clipboard!'); }
    catch(e){ alert('Sharing not supported'); }
  }
}

/*********************
 * Load initial content
**********************/ 
loadFact();


const date = new Date()
const year = date.getFullYear()
document.getElementById("current-year").innerHTML = year
