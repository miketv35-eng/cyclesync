// ─────────────────────────────────────────────
// CycleSync — Shared TypeScript Types
// ─────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  units: "metric" | "imperial";
  weight_kg: number | null;
  ftp_watts: number | null;
  created_at: string;
  updated_at: string;
}

export interface Ride {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  distance_m: number;
  duration_s: number;
  elevation_gain_m: number;
  avg_speed_kmh: number;
  max_speed_kmh: number;
  avg_heart_rate: number | null;
  max_heart_rate: number | null;
  calories: number | null;
  route_geojson: GeoJSON | null;
  bike_id: string | null;
  visibility: "public" | "followers" | "private";
  started_at: string;
  ended_at: string;
  created_at: string;
  profile?: Profile;
  bike?: Bike;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export interface Route {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  distance_m: number;
  elevation_gain_m: number;
  estimated_duration_s: number;
  difficulty: "easy" | "moderate" | "hard" | "extreme";
  surface: "road" | "gravel" | "mtb" | "mixed";
  route_geojson: GeoJSON;
  waypoints: Waypoint[];
  is_public: boolean;
  gpx_url: string | null;
  created_at: string;
  profile?: Profile;
}

export interface Waypoint {
  lat: number;
  lng: number;
  elevation?: number;
  name?: string;
}

export interface Bike {
  id: string;
  user_id: string;
  name: string;
  type: "road" | "gravel" | "mtb" | "endurance" | "ebike" | "cyclocross";
  brand: string | null;
  model: string | null;
  year: number | null;
  weight_kg: number | null;
  color: string | null;
  photo_url: string | null;
  total_km: number;
  is_primary: boolean;
  created_at: string;
  accessories?: Accessory[];
}

export interface Accessory {
  id: string;
  bike_id: string;
  name: string;
  category: "lights" | "gps" | "power_meter" | "cadence" | "heart_rate" | "other";
  brand: string | null;
  model: string | null;
  install_date: string | null;
  total_km: number;
  service_interval_km: number | null;
  notes: string | null;
}

export interface Club {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  invite_code: string;
  is_private: boolean;
  level: "all" | "beginner" | "intermediate" | "advanced";
  location: string | null;
  member_count?: number;
  total_km?: number;
  created_at: string;
  profile?: Profile;
  is_member?: boolean;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  profile?: Profile;
}

export interface ClubPost {
  id: string;
  club_id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  ride_id: string | null;
  created_at: string;
  profile?: Profile;
  likes_count?: number;
}

export interface GroupRide {
  id: string;
  club_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  start_lat: number;
  start_lng: number;
  start_address: string | null;
  route_id: string | null;
  distance_m: number | null;
  difficulty: "easy" | "moderate" | "hard";
  max_participants: number | null;
  rsvp_count?: number;
  is_rsvped?: boolean;
  profile?: Profile;
}

export interface Device {
  id: string;
  user_id: string;
  provider: "garmin" | "apple_watch" | "wahoo" | "polar" | "suunto" | "strava";
  device_name: string;
  device_model: string | null;
  is_connected: boolean;
  last_sync: string | null;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  created_at: string;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  tiles: DashboardTile[];
}

export interface DashboardTile {
  id: string;
  type: TileType;
  position: number;
  size: "sm" | "md" | "lg";
  visible: boolean;
}

export type TileType =
  | "start_ride"
  | "plan_route"
  | "ride_history"
  | "weekly_stats"
  | "weather"
  | "clubs"
  | "devices"
  | "bike_garage"
  | "upcoming_routes"
  | "leaderboard"
  | "feed";

export interface LiveRideState {
  status: "idle" | "active" | "paused" | "finished";
  elapsed_s: number;
  distance_m: number;
  current_speed_kmh: number;
  avg_speed_kmh: number;
  max_speed_kmh: number;
  elevation_gain_m: number;
  calories: number;
  heart_rate: number | null;
  positions: [number, number][];
  started_at: string | null;
}

export interface WeatherData {
  temp_c: number;
  feels_like_c: number;
  condition: string;
  icon: string;
  wind_kmh: number;
  wind_direction: string;
  humidity: number;
  rain_chance: number;
  uv_index: number;
  visibility_km: number;
  sunrise: string;
  sunset: string;
  forecast: WeatherForecastDay[];
}

export interface WeatherForecastDay {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  condition: string;
  rain_chance: number;
}

// GeoJSON types (simplified)
export interface GeoJSON {
  type: string;
  coordinates?: number[][] | number[][][];
  features?: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, unknown>;
}
