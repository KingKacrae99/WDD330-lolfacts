/*******************************************************
 *  Joke Service / API Intrgration 
*******************************************************/
export default class JokeService {
  static base = 'https://v2.jokeapi.dev';
  static async getRandomJoke(category='Any'){
    const url = `${JokeService.base}/joke/${encodeURIComponent(category)}?safe-mode`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Joke API failed');
    const j = await res.json();
    console.log(j)
    const text = j.type === 'single' ? j.joke : `${j.setup}\n\n${j.delivery}`;
    return {
      id: `${j.id}-${j.category}`,
      text,
      type: 'joke',
      source: 'JokeAPI',
      permalink: null,
      language: j.lang || 'en',
      category: j.category,
      flags: j.flags || {},
      safe: Boolean(j.safe),
      fetchedAt: Date.now()
    };
  }
}
