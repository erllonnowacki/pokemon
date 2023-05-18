export interface Pokemon {
  name: string;
  height: number;
  weight: number;
  image: string;
  code: number;
  types: { name: string }[];
  stats: { name: string; value: number }[];
}
