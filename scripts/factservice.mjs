/**********************************
 * fetch facts from api
**********************************/
export default class FactService {
  static endpoint = 'https://uselessfacts.jsph.pl/random.json?language=en';
  static async getRandomFact() {
    const res = await fetch(FactService.endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fact API failed');
    const data = await res.json();
    return {
      id: data.id || crypto.randomUUID(),
      text: data.text,
      type: 'fact',
      source: data.source || 'UselessFacts',
      permalink: data.permalink || null,
      language: data.language || 'en',
      category: 'General',
      flags: null,
      safe: true,
      fetchedAt: Date.now()
    };
  }
}
