import groupsData from "@/data/mock/groups.json";
import type { Group } from "./types";

const groups = groupsData as Group[];

export function getGroups(): Group[] {
  return groups;
}

export function getGroupById(id: string): Group | undefined {
  return groups.find((g) => g.id === id);
}
