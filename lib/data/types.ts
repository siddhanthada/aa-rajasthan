export type District = {
  id: string;
  name: string;
  displayOrder: number;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  locality: string;
  districtId: string;
  mapLink?: string;
};

export type Group = {
  id: string;
  name: string;
  districtId: string;
  contactChannel?: string;
};

export type Meeting = {
  id: string;
  groupId: string;
  venueId?: string;
  daysOfWeek: number[];
  startTime: string;
  endTime?: string;
  languages: ("hi" | "en")[];
  format: "in_person" | "online" | "hybrid";
  access: "open" | "closed";
  verificationStatus: "unverified" | "verified" | "needs_review";
  lastVerifiedAt?: string;
  published: boolean;
};

export type MeetingException = {
  id: string;
  meetingId: string;
  date: string;
  type: "cancelled" | "venue_changed" | "time_changed";
  note?: string;
};

export type CorrectionRequest = {
  id: string;
  meetingId: string;
  reason:
    | "meeting_didnt_happen"
    | "time_wrong"
    | "venue_changed"
    | "map_wrong"
    | "other";
  note?: string;
  status: "open" | "reviewed" | "dismissed";
  submittedAt: string;
};
