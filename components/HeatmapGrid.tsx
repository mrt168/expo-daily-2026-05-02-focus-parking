import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PALETTE, PALETTE_LIGHT, TEXT_SUBTLE, BORDER } from "../constants/colors";
import { COLOR_ORDER } from "../types";

interface Props {
  matrix: number[][]; // 7行(直近)×5色
}

const DAY_LABELS = ["今日", "1日前", "2日前", "3日前", "4日前", "5日前", "6日前"];

export function HeatmapGrid({ matrix }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={styles.labelCell} />
        {COLOR_ORDER.map((c) => (
          <View key={c} style={styles.headerCell}>
            <View style={[styles.headerDot, { backgroundColor: PALETTE[c] }]} />
          </View>
        ))}
      </View>
      {matrix.map((row, di) => (
        <View key={di} style={styles.row}>
          <Text style={styles.dayLabel}>{DAY_LABELS[di]}</Text>
          {row.map((count, ci) => {
            const color = COLOR_ORDER[ci];
            const bg = count > 0 ? PALETTE[color] : PALETTE_LIGHT[color];
            const opacity = count > 0 ? Math.min(0.4 + count * 0.2, 1) : 0.6;
            return (
              <View
                key={ci}
                style={[styles.cell, { backgroundColor: bg, opacity }]}
              >
                {count > 0 && <Text style={styles.count}>{count}</Text>}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 4 },
  headerRow: { flexDirection: "row", marginBottom: 4 },
  labelCell: { width: 60 },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  headerDot: { width: 12, height: 12, borderRadius: 6 },
  row: { flexDirection: "row", marginVertical: 2 },
  dayLabel: { width: 60, fontSize: 12, color: TEXT_SUBTLE, alignSelf: "center" },
  cell: {
    flex: 1,
    height: 28,
    marginHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  count: { fontSize: 12, fontWeight: "700", color: "#fff" },
});
