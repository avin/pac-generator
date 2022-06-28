import { getUrlContent } from './getUrlContent';

export const getListFromUrl = async (url: string): Promise<string[]> => {
  return (await getUrlContent(url)).split(/\r?\n/).filter((i) => !!i);
};
