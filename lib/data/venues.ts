import venuesData from "@/data/mock/venues.json";
import type { Venue } from "./types";

const venues = venuesData as Venue[];

export function getVenues(): Venue[] {
  return venues;
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}
