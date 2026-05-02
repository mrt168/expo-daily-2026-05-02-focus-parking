import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ACCENT_PURPLE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE, BORDER } from "../constants/colors";

interface Props {
  value: number;
  label: string;
  unit?: string;
}

export function BigNumber({ value, label, unit = "件" }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
  },
  label: { fontSize: 12, color: TEXT_SUBTLE, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "baseline", marginTop: 8 },
  value: { fontSize: 48, fontWeight: "800", color: ACCENT_PURPLE, lineHeight: 52 },
  unit: { fontSize: 16, color: TEXT_PRIMARY, marginLeft: 6 },
});
