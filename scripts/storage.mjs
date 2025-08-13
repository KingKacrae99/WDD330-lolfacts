/*******************************************************************************
 * Local storage to store favorite facts and joke, stats and preference settings
 *******************************************************************************/

const KEYS = {
  favs: 'lolfacts_favorites',
  settings: 'lolfacts_settings',
  stats: 'lolfacts_stats'
};

export const Storage = {
  getFavs(){ return JSON.parse(localStorage.getItem(KEYS.favs) || '[]'); },
  setFavs(arr){ localStorage.setItem(KEYS.favs, JSON.stringify(arr)); },

  getSettings(){ return JSON.parse(localStorage.getItem(KEYS.settings) || '{"theme":"light","category":"Any"}'); },
  setSettings(obj){ localStorage.setItem(KEYS.settings, JSON.stringify(obj)); },

  getStats(){ return JSON.parse(localStorage.getItem(KEYS.stats) || '{"facts":0,"jokes":0,"shares":0}'); },
  setStats(obj){ localStorage.setItem(KEYS.stats, JSON.stringify(obj)); }
};
