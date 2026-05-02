import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, SafeAreaView } from "react-native";
import { useConcerns } from "../../context/ConcernContext";
import { BG_BASE, PALETTE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE, BORDER, ACCENT_PURPLE } from "../../constants/colors";
import { COLOR_ORDER, type NotificationSlot } from "../../types";

const SLOT_LABELS: Record<NotificationSlot, string> = {
  morning: "朝（08:00）",
  lunch: "昼（12:30）",
  evening: "夕（18:00）",
  night: "夜（22:00）",
};

const ALL_SLOTS: NotificationSlot[] = ["morning", "lunch", "evening", "night"];

export default function SettingsScreen() {
  const { labels, settings, updateLabel, updateNotificationSlots, resetOnboarding } = useConcerns();
  const [draftLabels, setDraftLabels] = useState<Record<string, string>>(
    Object.fromEntries(labels.map((l) => [l.color, l.name]))
  );

  const handleLabelBlur = (color: string) => {
    const next = draftLabels[color]?.trim();
    if (next) updateLabel(color as any, next);
  };

  const toggleSlot = (slot: NotificationSlot) => {
    const next = settings.notificationSlots.includes(slot)
      ? settings.notificationSlots.filter((s) => s !== slot)
      : [...settings.notificationSlots, slot];
    updateNotificationSlots(next);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>設定</Text>

        <Text style={styles.sectionTitle}>色のラベル</Text>
        <Text style={styles.hint}>あなたの気がかりに合わせてラベルを編集できます</Text>
        {COLOR_ORDER.map((color) => (
          <View key={color} style={styles.labelRow}>
            <View style={[styles.dot, { backgroundColor: PALETTE[color] }]} />
            <TextInput
              value={draftLabels[color] ?? ""}
              onChangeText={(t) => setDraftLabels((prev) => ({ ...prev, [color]: t }))}
              onBlur={() => handleLabelBlur(color)}
              style={styles.input}
              placeholder="ラベル名"
              placeholderTextColor={TEXT_SUBTLE}
              maxLength={20}
              accessibilityLabel={`${color}のラベル`}
            />
          </View>
        ))}

        <Text style={styles.sectionTitle}>通知タイミング</Text>
        <Text style={styles.hint}>仕分けを促す通知の時間帯を選びます</Text>
        {ALL_SLOTS.map((slot) => {
          const enabled = settings.notificationSlots.includes(slot);
          return (
            <Pressable
              key={slot}
              onPress={() => toggleSlot(slot)}
              style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.7 }]}
              accessibilityLabel={`${SLOT_LABELS[slot]}の通知を${enabled ? "オフ" : "オン"}にする`}
            >
              <Text style={styles.toggleLabel}>{SLOT_LABELS[slot]}</Text>
              <View style={[styles.toggleDot, enabled && styles.toggleDotOn]}>
                <Text style={styles.toggleMark}>{enabled ? "オン" : "オフ"}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          onPress={resetOnboarding}
          style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.resetLabel}>オンボーディングを再表示</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "700", color: TEXT_PRIMARY },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 24 },
  hint: { fontSize: 12, color: TEXT_SUBTLE, marginTop: 4, marginBottom: 8 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  dot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: TEXT_PRIMARY, padding: 0 },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  toggleLabel: { fontSize: 15, color: TEXT_PRIMARY, flex: 1 },
  toggleDot: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: BORDER,
  },
  toggleDotOn: { backgroundColor: ACCENT_PURPLE },
  toggleMark: { fontSize: 11, fontWeight: "700", color: "#fff" },
  resetBtn: { marginTop: 30, alignSelf: "center" },
  resetLabel: { fontSize: 13, color: TEXT_SUBTLE, textDecorationLine: "underline" },
});
