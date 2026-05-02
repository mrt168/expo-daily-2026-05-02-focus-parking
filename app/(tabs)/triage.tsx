import React, { useMemo, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useConcerns } from "../../context/ConcernContext";
import { BG_BASE, PALETTE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE, BORDER, ACCENT_PURPLE } from "../../constants/colors";
import type { ConcernStatus } from "../../types";

const ACTIONS: { key: ConcernStatus; label: string; emoji: string }[] = [
  { key: "done", label: "対応した", emoji: "✅" },
  { key: "released", label: "手放す", emoji: "🌬️" },
  { key: "dismissed", label: "気にしない", emoji: "🙅" },
];

export default function TriageScreen() {
  const { concerns, getLabel, setConcernStatus } = useConcerns();

  const queue = useMemo(
    () => concerns.filter((c) => c.status === "parked").sort((a, b) => a.parkedAt.localeCompare(b.parkedAt)),
    [concerns]
  );

  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index >= queue.length) setIndex(0);
  }, [queue.length, index]);

  const current = queue[index];

  if (!current) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌿</Text>
          <Text style={styles.emptyText}>仕分け待ちの気がかりはありません</Text>
          <Text style={styles.emptySub}>頭がスッキリしている証拠です</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAction = (status: ConcernStatus) => {
    setConcernStatus(current.id, status);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          {index + 1} / {queue.length}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={[styles.colorBadge, { backgroundColor: PALETTE[current.color] }]}>
          <Text style={styles.colorBadgeText}>{getLabel(current.color)?.name}</Text>
        </View>
        <Text style={styles.text}>{current.text || "（本文未入力）"}</Text>
        <Text style={styles.parkedAt}>
          {new Date(current.parkedAt).toLocaleDateString("ja-JP")} に駐車
        </Text>
      </View>

      <View style={styles.actions}>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => handleAction(a.key)}
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            accessibilityLabel={a.label}
            testID={`triage-${a.key}`}
          >
            <Text style={styles.actionEmoji}>{a.emoji}</Text>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE, padding: 20 },
  header: { alignItems: "center", marginBottom: 12 },
  progress: { fontSize: 14, color: TEXT_SUBTLE },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 24,
    minHeight: 240,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
  },
  colorBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 16 },
  colorBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  text: { fontSize: 22, fontWeight: "600", color: TEXT_PRIMARY, lineHeight: 32 },
  parkedAt: { marginTop: 16, fontSize: 12, color: TEXT_SUBTLE },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  actionBtn: {
    flex: 1,
    backgroundColor: SURFACE,
    paddingVertical: 18,
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: { fontSize: 13, color: TEXT_PRIMARY, marginTop: 6, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyEmoji: { fontSize: 56 },
  emptyText: { fontSize: 18, fontWeight: "600", color: TEXT_PRIMARY, marginTop: 12 },
  emptySub: { fontSize: 13, color: TEXT_SUBTLE, marginTop: 6 },
});
