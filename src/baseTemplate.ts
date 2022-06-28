export const baseTemplate = `\
const proxies = __PROXIES__;

function FindProxyForURL(url, host) {
  for (const proxy of proxies) {
    // -------
    // Check if the host in domains-list
    // -------
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

    // -------
    // Check if the host in ips-list
    // -------
    let isMatchIpMask = false;

    let hostIp;
    let isIpV4Addr = /^(\\d+.){3}\\d+$/;
    if (isIpV4Addr.test(host)){
      hostIp = host;
    } else {
      hostIp = dnsResolve(host);
    }
    for (const ipWithMask of proxy.ips) {
      isMatchIpMask = isMatchIpMask || isInNet(hostIp, ipWithMask[0], ipWithMask[1]);
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


