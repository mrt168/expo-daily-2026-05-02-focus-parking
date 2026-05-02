import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PALETTE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE, BORDER } from "../constants/colors";
import type { Concern } from "../types";

interface Props {
  concern: Concern;
  onPress: () => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function ConcernCard({ concern, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
      accessibilityLabel={concern.text || "本文未入力の気がかり"}
    >
      <View style={[styles.dot, { backgroundColor: PALETTE[concern.color] }]} />
      <Text style={styles.text} numberOfLines={1}>
        {concern.text || "（本文未入力）"}
      </Text>
      <Text style={styles.time}>{formatTime(concern.parkedAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  dot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  text: { flex: 1, fontSize: 16, color: TEXT_PRIMARY },
  time: { fontSize: 12, color: TEXT_SUBTLE, marginLeft: 8 },
});
