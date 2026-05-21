import { Airport } from "@/constants/Airports";

export interface SearchState {
  origin: Airport | null;
  destination: Airport | null;
  date: string;
}

export interface Preferences {}
