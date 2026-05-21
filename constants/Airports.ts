export interface Airport {
  code: string;
  city: string;
  country: string;
}

export const AIRPORTS: Airport[] = [
  { code: "MNL", city: "Manila", country: "Philippines" },
  { code: "CEB", city: "Cebu", country: "Philippines" },
  { code: "MPH", city: "Caticlan (Boracay)", country: "Philippines" },
  { code: "CRK", city: "Clark", country: "Philippines" },
  { code: "DVO", city: "Davao", country: "Philippines" },
  { code: "ILO", city: "Iloilo", country: "Philippines" },
  { code: "BCD", city: "Bacolod", country: "Philippines" },
  { code: "TAG", city: "Tagbilaran", country: "Philippines" },
  { code: "PPS", city: "Puerto Princesa", country: "Philippines" },
  { code: "ZAM", city: "Zamboanga", country: "Philippines" },
  { code: "CGY", city: "Cagayan de Oro", country: "Philippines" },
  { code: "SIN", city: "Singapore", country: "Singapore" },
  { code: "HKG", city: "Hong Kong", country: "China" },
  { code: "NRT", city: "Tokyo Narita", country: "Japan" },
  { code: "HND", city: "Tokyo Haneda", country: "Japan" },
  { code: "KIX", city: "Osaka Kansai", country: "Japan" },
  { code: "ICN", city: "Seoul Incheon", country: "South Korea" },
  { code: "BKK", city: "Bangkok", country: "Thailand" },
  { code: "DMK", city: "Bangkok Don Mueang", country: "Thailand" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "SGN", city: "Ho Chi Minh City", country: "Vietnam" },
  { code: "HAN", city: "Hanoi", country: "Vietnam" },
  { code: "DPS", city: "Bali Denpasar", country: "Indonesia" },
  { code: "CGK", city: "Jakarta", country: "Indonesia" },
  { code: "TPE", city: "Taipei", country: "Taiwan" },
  { code: "PEK", city: "Beijing", country: "China" },
  { code: "PVG", city: "Shanghai", country: "China" },
  { code: "DEL", city: "New Delhi", country: "India" },
  { code: "BOM", city: "Mumbai", country: "India" },
  { code: "SYD", city: "Sydney", country: "Australia" },
  { code: "MEL", city: "Melbourne", country: "Australia" },
  { code: "AKL", city: "Auckland", country: "New Zealand" },
  { code: "LAX", city: "Los Angeles", country: "USA" },
  { code: "SFO", city: "San Francisco", country: "USA" },
  { code: "JFK", city: "New York JFK", country: "USA" },
  { code: "ORD", city: "Chicago O'Hare", country: "USA" },
  { code: "LHR", city: "London Heathrow", country: "UK" },
  { code: "CDG", city: "Paris Charles de Gaulle", country: "France" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "IST", city: "Istanbul", country: "Turkey" },
  { code: "FCO", city: "Rome", country: "Italy" },
  { code: "BCN", city: "Barcelona", country: "Spain" },
  { code: "FRA", city: "Frankfurt", country: "Germany" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands" },
  { code: "YVR", city: "Vancouver", country: "Canada" },
  { code: "YYZ", city: "Toronto", country: "Canada" },
  { code: "GRU", city: "Sao Paulo", country: "Brazil" },
  { code: "MEX", city: "Mexico City", country: "Mexico" },
  { code: "JNB", city: "Johannesburg", country: "South Africa" },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.trim().length === 0) return [];
  const normalizedQuery = query.toLowerCase().trim();
  return AIRPORTS.filter(
    (airport) =>
      airport.code.toLowerCase().includes(normalizedQuery) ||
      airport.city.toLowerCase().includes(normalizedQuery) ||
      airport.country.toLowerCase().includes(normalizedQuery)
  ).slice(0, 6);
}
