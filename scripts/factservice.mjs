
export default class FactService {
  static async getRandomFact() {
    const url = 'https://uselessfacts.jsph.pl/random.json?language=en';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      // normalize shape
      return {
        id: data.id || data.source || Date.now().toString(),
        text: data.text || data.phrase || 'No text returned',
        source: data.source || null,
        permalink: data.permalink || null
      };
    } catch (err) {
        console.error('Fact fetch failed:', err);
        
      const fallback = [
        { id: 'f1', text: 'Polar bears are left-handed.'},
        { id: 'f2', text: 'A group of flamingos is called a "flamboyance".' },
        { id: 'f3', text: 'Bananas are berries, but strawberries are not.' }
      ];
      return fallback[Math.floor(Math.random()*fallback.length)];
    }
  }
}
