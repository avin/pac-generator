import https from 'https';
import http from 'http';

export class ListGetter {
  private cache: Record<string, { data: string; time: number }> = {};

  constructor(public cacheTime = 5 * 60 * 1000) {}

  async getUrlContent(url: string): Promise<string> {
    if (this.cache[url] && new Date().getTime() - this.cache[url].time > this.cacheTime) {
      return this.cache[url].data;
    }
    const res = await new Promise<string>((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;

      client
        .get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(data);
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
    this.cache[url] = { data: res, time: new Date().getTime() };
    return res;
  }

  async getListFromUrl(url: string): Promise<string[]> {
    const content = await this.getUrlContent(url);
    try {
      return JSON.parse(content) as string[];
    } catch {}

    return content.split(/\r?\n/).filter((i) => !!i);
  }
}
