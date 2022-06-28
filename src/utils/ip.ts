export const netmask2CIDR = (netmask: string) =>
  netmask
    .split('.')
    .map(Number)
    .map((part) => (part >>> 0).toString(2))
    .join('')
    .split('1').length - 1;

export const CIDR2netmask = (bitCount: number) => {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.min(bitCount, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    bitCount -= n;
  }
  return mask.join('.');
};
