export const baseTemplate = `\
const proxies = __PROXIES__;

function FindProxyForURL(url, host) {
  for (const proxy of proxies) {
    let isMatchDomain = false;
    for (const domain of proxy.domains) {
      isMatchDomain = isMatchDomain || dnsDomainIs(host, domain);
      if (isMatchDomain) {
        break;
      }
    }
    if (isMatchDomain) {
      return proxy.connection;
    }
    let isMatchIpMask = false;
    for (const ipWithMask of proxy.ips) {
      isMatchIpMask = isMatchIpMask || isInNet(host, ipWithMask[0], ipWithMask[1]);
      if (isMatchDomain) {
        break;
      }
    }
    if (isMatchIpMask) {
      return proxy.connection;
    }
  }
  return 'DIRECT';
}
`;


