export type ConcernColor = "red" | "blue" | "yellow" | "green" | "purple";

export type ConcernStatus = "parked" | "done" | "dismissed" | "released";

export interface Concern {
  id: string;
  color: ConcernColor;
  text: string;
  parkedAt: string;
  resolvedAt?: string;
  status: ConcernStatus;
}

export interface ColorLabel {
  color: ConcernColor;
  name: string;
  defaultName: string;
}

export type NotificationSlot = "morning" | "lunch" | "evening" | "night";

export interface Settings {
  notificationSlots: NotificationSlot[];
  hasCompletedOnboarding: boolean;
  installedAt: string;
}

export const STORAGE_KEYS = {
  concerns: "@focus-parking/concerns/v1",
  labels: "@focus-parking/labels/v1",
  settings: "@focus-parking/settings/v1",
} as const;

export const COLOR_ORDER: ConcernColor[] = ["red", "blue", "yellow", "green", "purple"];
