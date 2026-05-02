import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PALETTE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE } from "../constants/colors";
import type { ConcernColor } from "../types";

interface Props {
  color: ConcernColor;
  label: string;
  onPress: () => void;
  testID?: string;
}

export function ColorButton({ color, label, onPress, testID }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      accessibilityLabel={`${label}に駐車する`}
      testID={testID}
    >
      <View style={[styles.circle, { backgroundColor: PALETTE[color] }]} />
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>タップで駐車</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  labelWrap: { flex: 1 },
  label: { fontSize: 18, fontWeight: "600", color: TEXT_PRIMARY },
  hint: { fontSize: 12, color: TEXT_SUBTLE, marginTop: 2 },
});
