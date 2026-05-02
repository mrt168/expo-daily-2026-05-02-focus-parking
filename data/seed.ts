import type { Concern, ColorLabel } from "../types";
import { DEFAULT_LABEL_NAMES } from "../constants/colors";
import { COLOR_ORDER } from "../types";

export const SEED_LABELS: ColorLabel[] = COLOR_ORDER.map((color) => ({
  color,
  name: DEFAULT_LABEL_NAMES[color],
  defaultName: DEFAULT_LABEL_NAMES[color],
}));

const today = new Date();
const todayIso = (h: number, m: number) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const yesterdayIso = (h: number, m: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const SEED_CONCERNS: Concern[] = [
  {
    id: "seed-1",
    color: "red",
    text: "議事録の続きを書く",
    parkedAt: todayIso(13, 45),
    status: "parked",
  },
  {
    id: "seed-2",
    color: "red",
    text: "来週の出張準備",
    parkedAt: todayIso(11, 20),
    status: "parked",
  },
  {
    id: "seed-3",
    color: "blue",
    text: "請求書の確認",
    parkedAt: todayIso(10, 5),
    status: "parked",
  },
  {
    id: "seed-4",
    color: "yellow",
    text: "英語学習の本を読む",
    parkedAt: todayIso(9, 30),
    status: "parked",
  },
  {
    id: "seed-5",
    color: "yellow",
    text: "写真を整理する",
    parkedAt: yesterdayIso(20, 10),
    status: "parked",
  },
];
