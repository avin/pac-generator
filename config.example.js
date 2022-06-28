module.exports = {
  outputPacFile: './proxies.pac',
  proxies: [
    {
      destination: 'SOCKS5 127.0.0.1:7777',
      domains: ['wixmp.com'],
      domainsUrls: ['https://community.antifilter.download/list/domains.lst'],
      ips: [],
      ipsUrls: ['https://antifilter.download/list/allyouneed.lst'],
    },
  ],
};
