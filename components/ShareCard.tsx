import React, { forwardRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ACCENT_PURPLE, BG_BASE, TEXT_PRIMARY, TEXT_SUBTLE, PALETTE } from "../constants/colors";
import { COLOR_ORDER } from "../types";

interface Props {
  releasedCount: number;
  parkedCount: number;
  matrix: number[][];
}

export const ShareCard = forwardRef<View, Props>(({ releasedCount, parkedCount, matrix }, ref) => {
  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <Text style={styles.title}>気がかりパーキング</Text>
      <Text style={styles.subtitle}>今週の駐車レポート</Text>

      <View style={styles.bigBox}>
        <Text style={styles.bigValue}>{releasedCount}</Text>
        <Text style={styles.bigLabel}>件の気がかりを手放しました</Text>
      </View>

      <View style={styles.grid}>
        {matrix.map((row, di) => (
          <View key={di} style={styles.row}>
            {row.map((count, ci) => {
              const color = COLOR_ORDER[ci];
              return (
                <View
                  key={ci}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: count > 0 ? PALETTE[color] : "#EEE9DF",
                      opacity: count > 0 ? Math.min(0.5 + count * 0.15, 1) : 0.6,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        現在 {parkedCount} 件を駐車中 · #気がかりパーキング
      </Text>
    </View>
  );
});

ShareCard.displayName = "ShareCard";

const styles = StyleSheet.create({
  card: {
    width: 360,
    backgroundColor: BG_BASE,
    padding: 28,
    borderRadius: 24,
  },
  title: { fontSize: 14, color: TEXT_SUBTLE, fontWeight: "600" },
  subtitle: { fontSize: 22, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 4 },
  bigBox: { marginTop: 18 },
  bigValue: { fontSize: 72, fontWeight: "800", color: ACCENT_PURPLE, lineHeight: 76 },
  bigLabel: { fontSize: 14, color: TEXT_PRIMARY, marginTop: 4 },
  grid: { marginTop: 18 },
  row: { flexDirection: "row", marginVertical: 2 },
  cell: { flex: 1, height: 16, marginHorizontal: 2, borderRadius: 4 },
  footer: { marginTop: 18, fontSize: 11, color: TEXT_SUBTLE },
});
