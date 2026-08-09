import meetingsData from "@/data/mock/meetings.json";
import type { Meeting } from "./types";
import { getGroupById } from "./groups";
import { getVenueById } from "./venues";
import { getDistrictById } from "./districts";

const meetings = meetingsData as Meeting[];

export type MeetingFilters = {
  districtId?: string;
  day?: number;
  language?: "hi" | "en";
  format?: Meeting["format"];
};

export type MeetingWithDetails = Meeting & {
  groupName: string;
  contactChannel?: string;
  venueName?: string;
  venueAddress?: string;
  venueLocality?: string;
  mapLink?: string;
  districtId: string;
  districtName: string;
};

function withDetails(meeting: Meeting): MeetingWithDetails | undefined {
  const group = getGroupById(meeting.groupId);
  if (!group) return undefined;

  const venue = meeting.venueId ? getVenueById(meeting.venueId) : undefined;
  const districtId = venue?.districtId ?? group.districtId;
  const district = getDistrictById(districtId);

  return {
    ...meeting,
    groupName: group.name,
    contactChannel: group.contactChannel,
    venueName: venue?.name,
    venueAddress: venue?.address,
    venueLocality: venue?.locality,
    mapLink: venue?.mapLink,
    districtId,
    districtName: district?.name ?? districtId,
  };
}

export function getMeetings(): Meeting[] {
  return meetings.filter((m) => m.published);
}

export function getMeetingById(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function getMeetingWithDetailsById(
  id: string,
): MeetingWithDetails | undefined {
  const meeting = meetings.find((m) => m.id === id && m.published);
  return meeting ? withDetails(meeting) : undefined;
}

export function getMeetingsWithDetails(
  filters: MeetingFilters = {},
): MeetingWithDetails[] {
  return meetings
    .filter((m) => m.published)
    .map(withDetails)
    .filter((m): m is MeetingWithDetails => m !== undefined)
    .filter((m) => {
      if (filters.districtId && m.districtId !== filters.districtId) {
        return false;
      }
      if (filters.day !== undefined && !m.daysOfWeek.includes(filters.day)) {
        return false;
      }
      if (filters.language && !m.languages.includes(filters.language)) {
        return false;
      }
      if (filters.format && m.format !== filters.format) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dayA = Math.min(...a.daysOfWeek);
      const dayB = Math.min(...b.daysOfWeek);
      if (dayA !== dayB) return dayA - dayB;
      return a.startTime.localeCompare(b.startTime);
    });
}
