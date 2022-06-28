# PAC-Generator

## Install

```sh
npm install -g pac-maker
```

## Usage

```sh
pac-maker --config ./config.js
```

## Config example

```js
module.exports = {
  outputPacFile: './proxy.pac',
  proxies: [
    {
      // Proxy in PAC format  
      destination: 'SOCKS5 127.0.0.1:7777',

      // Custom domains
      domains: ['wixmp.com'],

      // Domain-lists URLs
      domainsUrls: ['https://community.antifilter.download/list/domains.lst'],

      // Custom IPs
      ips: [],

      // IP-lists URLs
      ipsUrls: ['https://antifilter.download/list/allyouneed.lst'],
    },
  ],
};
```
