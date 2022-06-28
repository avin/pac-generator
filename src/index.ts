import { baseTemplate } from './baseTemplate';
import { CIDR2netmask } from './utils/ip';
import { ListGetter } from './listGetter';

type ProxyOptions = {
  connection: string;
  ipsUrls?: string;
  domainsUrls?: string;
  domains?: string[];
  ips?: string[];
};

export type PacGeneratorOptions = {
  template?: string;
  getListCacheTime?: number;
  proxies: ProxyOptions[];
};

export class PacGenerator {
  listGetter!: ListGetter;

  constructor(private options: PacGeneratorOptions) {
    this.listGetter = new ListGetter(this.options.getListCacheTime || 0);
  }

  private async getIpList(proxyOptions: ProxyOptions) {
    const result = [];

    if (proxyOptions.ipsUrls) {
      for (const domainsUrl of proxyOptions.ipsUrls) {
        result.push(...(await this.listGetter.getListFromUrl(domainsUrl)));
      }
    }

    if (proxyOptions.ips) {
      result.push(...proxyOptions.ips);
    }

    return result;
  }

  private async getDomainList(proxyOptions: ProxyOptions) {
    const result = [];

    if (proxyOptions.domainsUrls) {
      for (const domainsUrl of proxyOptions.domainsUrls) {
        result.push(...(await this.listGetter.getListFromUrl(domainsUrl)));
      }
    }

    if (proxyOptions.domains) {
      result.push(...proxyOptions.domains);
    }

    return result;
  }

  async generate() {
    const proxies = [];
    for (const proxyOptions of this.options.proxies) {
      const ipList = await this.getIpList(proxyOptions);
      const domainList = await this.getDomainList(proxyOptions);

      const ipsMap: Record<string, [string, string][]> = {};
      for (const record of ipList) {
        const [ip, mask] = (() => {
          if (record.includes('/')) {
            const [ip, cidr] = record.split('/');
            const mask = CIDR2netmask(Number(cidr));
            return [ip, mask];
          }
          return [record, '255.255.255.255'];
        })();

        const ipParts = ip.split('.');

        const key = `${ipParts[0]}.${ipParts[1]}.`;
        ipsMap[key] = ipsMap[key] || [];
        ipsMap[key].push([ip, mask]);
      }

      proxies.push({
        connection: proxyOptions.connection,
        domains: domainList,
        ipsMap,
      });
    }

    const template = this.options.template || baseTemplate;

    return template.replace('__PROXIES__', JSON.stringify(proxies, null, 2));
  }
}
