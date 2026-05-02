import type { ConcernColor } from "../types";

export const PALETTE: Record<ConcernColor, string> = {
  red: "#E76F51",
  blue: "#2A9D8F",
  yellow: "#F4A261",
  green: "#6FB07F",
  purple: "#8E7CC3",
};

export const PALETTE_LIGHT: Record<ConcernColor, string> = {
  red: "#FBE2DA",
  blue: "#D7EDE9",
  yellow: "#FBE0C8",
  green: "#D9EBDD",
  purple: "#E2DBEE",
};

export const BG_BASE = "#FAF8F4";
export const TEXT_PRIMARY = "#2D2A26";
export const TEXT_SUBTLE = "#85807A";
export const SURFACE = "#FFFFFF";
export const BORDER = "#E8E4DC";
export const ACCENT_PURPLE = "#8E7CC3";

export const DEFAULT_LABEL_NAMES: Record<ConcernColor, string> = {
  red: "今すぐ対応",
  blue: "今日中",
  yellow: "いつか",
  green: "誰かに共有",
  purple: "手放したい",
};
