import https from 'https';
import http from 'http';

export const getUrlContent = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
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
};
