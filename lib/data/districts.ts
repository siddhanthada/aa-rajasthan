import districtsData from "@/data/mock/districts.json";
import type { District } from "./types";

const districts = districtsData as District[];

export function getDistricts(): District[] {
  return [...districts].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getDistrictById(id: string): District | undefined {
  return districts.find((d) => d.id === id);
}
