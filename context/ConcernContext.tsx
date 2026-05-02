import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  Concern,
  ColorLabel,
  ConcernColor,
  ConcernStatus,
  NotificationSlot,
  Settings,
} from "../types";
import { COLOR_ORDER, STORAGE_KEYS } from "../types";
import { SEED_CONCERNS, SEED_LABELS } from "../data/seed";
import { loadJson, saveJson } from "../utils/storage";
import { newId } from "../utils/id";

interface ConcernContextValue {
  concerns: Concern[];
  labels: ColorLabel[];
  settings: Settings;
  hydrated: boolean;
  parkedCount: number;
  releasedCount: number;
  doneCount: number;
  dismissedCount: number;
  weeklyMatrix: number[][];
  addConcern: (color: ConcernColor) => Concern;
  updateConcernText: (id: string, text: string) => void;
  setConcernStatus: (id: string, status: ConcernStatus) => void;
  deleteConcern: (id: string) => void;
  updateLabel: (color: ConcernColor, name: string) => void;
  updateNotificationSlots: (slots: NotificationSlot[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  getConcern: (id: string) => Concern | undefined;
  getLabel: (color: ConcernColor) => ColorLabel | undefined;
}

const defaultSettings: Settings = {
  notificationSlots: ["lunch", "night"],
  hasCompletedOnboarding: false,
  installedAt: new Date().toISOString(),
};

const ConcernContext = createContext<ConcernContextValue | null>(null);

export function ConcernProvider({ children }: { children: React.ReactNode }) {
  const [concerns, setConcerns] = useState<Concern[]>(SEED_CONCERNS);
  const [labels, setLabels] = useState<ColorLabel[]>(SEED_LABELS);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, l, s] = await Promise.all([
        loadJson<Concern[]>(STORAGE_KEYS.concerns, SEED_CONCERNS),
        loadJson<ColorLabel[]>(STORAGE_KEYS.labels, SEED_LABELS),
        loadJson<Settings>(STORAGE_KEYS.settings, defaultSettings),
      ]);
      setConcerns(c);
      setLabels(l);
      setSettings(s);
      setHydrated(true);
    })();
  }, []);

  const persistConcerns = useCallback((next: Concern[]) => {
    setConcerns(next);
    saveJson(STORAGE_KEYS.concerns, next);
  }, []);

  const persistLabels = useCallback((next: ColorLabel[]) => {
    setLabels(next);
    saveJson(STORAGE_KEYS.labels, next);
  }, []);

  const persistSettings = useCallback((next: Settings) => {
    setSettings(next);
    saveJson(STORAGE_KEYS.settings, next);
  }, []);

  const addConcern = useCallback(
    (color: ConcernColor): Concern => {
      const concern: Concern = {
        id: newId(),
        color,
        text: "",
        parkedAt: new Date().toISOString(),
        status: "parked",
      };
      persistConcerns([concern, ...concerns]);
      return concern;
    },
    [concerns, persistConcerns]
  );

  const updateConcernText = useCallback(
    (id: string, text: string) => {
      persistConcerns(
        concerns.map((c) => (c.id === id ? { ...c, text: text.slice(0, 140) } : c))
      );
    },
    [concerns, persistConcerns]
  );

  const setConcernStatus = useCallback(
    (id: string, status: ConcernStatus) => {
      persistConcerns(
        concerns.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                resolvedAt: status === "parked" ? undefined : new Date().toISOString(),
              }
            : c
        )
      );
    },
    [concerns, persistConcerns]
  );

  const deleteConcern = useCallback(
    (id: string) => {
      persistConcerns(concerns.filter((c) => c.id !== id));
    },
    [concerns, persistConcerns]
  );

  const updateLabel = useCallback(
    (color: ConcernColor, name: string) => {
      persistLabels(labels.map((l) => (l.color === color ? { ...l, name } : l)));
    },
    [labels, persistLabels]
  );

  const updateNotificationSlots = useCallback(
    (slots: NotificationSlot[]) => {
      persistSettings({ ...settings, notificationSlots: slots });
    },
    [settings, persistSettings]
  );

  const completeOnboarding = useCallback(() => {
    persistSettings({ ...settings, hasCompletedOnboarding: true });
  }, [settings, persistSettings]);

  const resetOnboarding = useCallback(() => {
    persistSettings({ ...settings, hasCompletedOnboarding: false });
  }, [settings, persistSettings]);

  const getConcern = useCallback(
    (id: string) => concerns.find((c) => c.id === id),
    [concerns]
  );
  const getLabel = useCallback(
    (color: ConcernColor) => labels.find((l) => l.color === color),
    [labels]
  );

  const parkedCount = useMemo(
    () => concerns.filter((c) => c.status === "parked").length,
    [concerns]
  );
  const releasedCount = useMemo(
    () => concerns.filter((c) => c.status === "released").length,
    [concerns]
  );
  const doneCount = useMemo(
    () => concerns.filter((c) => c.status === "done").length,
    [concerns]
  );
  const dismissedCount = useMemo(
    () => concerns.filter((c) => c.status === "dismissed").length,
    [concerns]
  );

  // 7日 x 5色のカウントマトリクス（インデックス 0=今日, 6=6日前）
  const weeklyMatrix = useMemo(() => {
    const matrix: number[][] = Array.from({ length: 7 }, () => Array(5).fill(0));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const c of concerns) {
      const d = new Date(c.parkedAt);
      d.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        const colorIdx = COLOR_ORDER.indexOf(c.color);
        matrix[diffDays][colorIdx] += 1;
      }
    }
    return matrix;
  }, [concerns]);

  const value: ConcernContextValue = {
    concerns,
    labels,
    settings,
    hydrated,
    parkedCount,
    releasedCount,
    doneCount,
    dismissedCount,
    weeklyMatrix,
    addConcern,
    updateConcernText,
    setConcernStatus,
    deleteConcern,
    updateLabel,
    updateNotificationSlots,
    completeOnboarding,
    resetOnboarding,
    getConcern,
    getLabel,
  };

  return <ConcernContext.Provider value={value}>{children}</ConcernContext.Provider>;
}

export function useConcerns(): ConcernContextValue {
  const ctx = useContext(ConcernContext);
  if (!ctx) throw new Error("useConcerns must be used within ConcernProvider");
  return ctx;
}
