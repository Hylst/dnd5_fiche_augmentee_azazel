import featsData from './allFeats.json';

export interface FeatData {
  id: string;
  name: string;
  trad: string;
  prerequisite: string;
  descriptionHtml: string;
  source: string;
}

export const allFeats: FeatData[] = featsData as FeatData[];
