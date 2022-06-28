import { getListFromUrl } from './utils/getListFromUrl';
import { baseTemplate } from './baseTemplate';
import { CIDR2netmask } from './utils/ip';

type ProxyOptions = {
  connection: string;
  ipsUrls?: string;
  domainsUrls?: string;
  domains?: string[];
  ips?: string[];
};

export type PacGeneratorOptions = {
  template?: string;
  proxies: ProxyOptions[];
};

export class PacGenerator {
  constructor(private options: PacGeneratorOptions) {}

  private async getIpList(proxyOptions: ProxyOptions) {
    const result = [];

    if (proxyOptions.ipsUrls) {
      for (const domainsUrl of proxyOptions.ipsUrls) {
        result.push(...(await getListFromUrl(domainsUrl)));
      }
    }

    if (proxyOptions.ips) {
      result.push(...proxyOptions.ips);
    }

    return result.reduce((acc, domain) => {
      acc.push(domain);
      return acc;
    }, [] as string[]);
  }

  private async getDomainList(proxyOptions: ProxyOptions) {
    const result = [];

    if (proxyOptions.domainsUrls) {
      for (const domainsUrl of proxyOptions.domainsUrls) {
        result.push(...(await getListFromUrl(domainsUrl)));
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

      const ipWithMaskList = ipList.map((record) => {
        if (record.includes('/')) {
          const [ip, cidr] = record.split('/');
          const mask = CIDR2netmask(Number(cidr));
          return [ip, mask];
        }
        return [record, '255.255.255.255'];
      });

      proxies.push({
        connection: proxyOptions.connection,
        domains: domainList,
        ips: ipWithMaskList,
      });
    }

    const template = this.options.template || baseTemplate;

    return template.replace('__PROXIES__', JSON.stringify(proxies, null, 2));
  }
}
