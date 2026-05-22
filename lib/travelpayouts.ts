import { Flight } from "@/constants/FlightData";

// Common airline name lookup by IATA code
const AIRLINE_NAMES: Record<string, string> = {
  "5J": "Cebu Pacific",
  PR: "Philippine Airlines",
  Z2: "AirAsia Philippines",
  QR: "Qatar Airways",
  SQ: "Singapore Airlines",
  CX: "Cathay Pacific",
  EK: "Emirates",
  TK: "Turkish Airlines",
  QF: "Qantas",
  BA: "British Airways",
  LH: "Lufthansa",
  AF: "Air France",
  KL: "KLM",
  NH: "ANA",
  JL: "Japan Airlines",
  AA: "American Airlines",
  UA: "United Airlines",
  DL: "Delta Air Lines",
  TG: "Thai Airways",
  MH: "Malaysia Airlines",
  GA: "Garuda Indonesia",
  VN: "Vietnam Airlines",
  OZ: "Asiana Airlines",
  KE: "Korean Air",
  AI: "Air India",
  ET: "Ethiopian Airlines",
  WY: "Oman Air",
  GF: "Gulf Air",
  FZ: "Flydubai",
  AK: "AirAsia",
  TR: "Scoot",
  "3K": "Jetstar Asia",
  FD: "Thai AirAsia",
  QZ: "Indonesia AirAsia",
  BI: "Royal Brunei Airlines",
  PG: "Bangkok Airways",
  MI: "SilkAir",
  UO: "HK Express",
  "7C": "Jeju Air",
  LJ: "Jin Air",
  TW: "T'way Air",
  ZE: "Eastar Jet",
  IT: "Tigerair Taiwan",
  MM: "Peach Aviation",
  SL: "Thai Lion Air",
  DD: "Nok Air",
  XJ: "Thai AirAsia X",
  D7: "AirAsia X",
};

interface TravelpayoutsFlightEntry {
  price: number;
  airline: string;
  flight_number: number;
  departure_at: string;
  return_at?: string;
  expires_at?: string;
  number_of_changes?: number;
  duration?: number;
}

interface TravelpayoutsResponse {
  success: boolean;
  data: Record<string, Record<string, TravelpayoutsFlightEntry>>;
}

function formatTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    const m = minutes.toString().padStart(2, "0");
    return `${h}:${m} ${ampm}`;
  } catch {
    return "—";
  }
}

function estimateArrivalTime(
  departureAt: string,
  durationMinutes?: number
): string {
  if (!durationMinutes) return "—";
  try {
    const dep = new Date(departureAt);
    if (isNaN(dep.getTime())) return "—";
    const arr = new Date(dep.getTime() + durationMinutes * 60 * 1000);
    return formatTime(arr.toISOString());
  } catch {
    return "—";
  }
}

function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "Direct";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getAirlineName(code: string): string {
  return AIRLINE_NAMES[code] || code;
}

function buildBookingUrl(
  origin: string,
  destination: string,
  departDate: string
): string {
  // Format date as DDMM for Aviasales search URL
  const d = new Date(departDate);
  const dd = d.getDate().toString().padStart(2, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  return `https://www.aviasales.com/search/${origin}${dd}${mm}${destination}1`;
}

export function mapTravelpayoutsResponse(
  response: TravelpayoutsResponse,
  origin: string,
  destination: string,
  departDate: string
): Flight[] {
  const flights: Flight[] = [];

  if (!response.success || !response.data) {
    return flights;
  }

  // The data is nested: { "DEST_CODE": { "0": {...}, "1": {...} } }
  for (const destCode of Object.keys(response.data)) {
    const entries = response.data[destCode];
    for (const key of Object.keys(entries)) {
      const entry = entries[key];
      if (!entry) continue;

      const airlineCode = entry.airline || "";
      const durationMinutes = entry.duration || 0;
      const departureTime = entry.departure_at
        ? formatTime(entry.departure_at)
        : "—";
      const arrivalTime = entry.departure_at
        ? estimateArrivalTime(entry.departure_at, durationMinutes)
        : "—";

      flights.push({
        id: `${airlineCode}-${entry.flight_number || key}-${destCode}`,
        airline_name: getAirlineName(airlineCode),
        airline_code: airlineCode,
        airline_logo: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${airlineCode}.svg`,
        price: entry.price,
        currency: "USD",
        duration: durationMinutes > 0 ? formatDuration(durationMinutes) : "Direct",
        duration_minutes: durationMinutes,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        flight_type:
          entry.number_of_changes === 0 || !entry.number_of_changes
            ? "Direct"
            : `${entry.number_of_changes} stop${entry.number_of_changes > 1 ? "s" : ""}`,
        booking_url: buildBookingUrl(origin, destination, departDate),
      });
    }
  }

  return flights;
}

export async function fetchFlights(
  origin: string,
  destination: string,
  departDate: string
): Promise<Flight[]> {
  const token = process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN;

  if (!token) {
    throw new Error("Travelpayouts API token is not configured");
  }

  // Format depart_date as YYYY-MM-DD or YYYY-MM
  const formattedDate = departDate; // Already in YYYY-MM-DD from the search form

  const params = new URLSearchParams({
    origin,
    destination,
    depart_date: formattedDate,
    currency: "USD",
    limit: "12",
  });

  const url = `https://api.travelpayouts.com/v1/prices/cheap?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-access-token": token,
      Accept: "application/json",
    },
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}: ${response.statusText}`
    );
  }

  const data: TravelpayoutsResponse = await response.json();

  if (!data.success) {
    throw new Error("API returned unsuccessful response");
  }

  const flights = mapTravelpayoutsResponse(data, origin, destination, departDate);

  if (flights.length === 0) {
    throw new Error("No flights found for this route and date");
  }

  return flights;
}
