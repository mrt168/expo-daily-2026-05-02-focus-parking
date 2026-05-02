import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConcerns } from "../../context/ConcernContext";
import { BG_BASE, PALETTE, SURFACE, TEXT_PRIMARY, TEXT_SUBTLE, BORDER, ACCENT_PURPLE } from "../../constants/colors";
import type { ConcernStatus } from "../../types";

const STATUS_CHOICES: { key: ConcernStatus; label: string }[] = [
  { key: "parked", label: "駐車中" },
  { key: "done", label: "対応した" },
  { key: "released", label: "手放した" },
  { key: "dismissed", label: "気にしない" },
];

export default function ConcernDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getConcern, getLabel, updateConcernText, setConcernStatus, deleteConcern } = useConcerns();

  const concern = id ? getConcern(id) : undefined;
  const [text, setText] = useState(concern?.text ?? "");

  useEffect(() => {
    if (concern) setText(concern.text);
  }, [concern?.id]);

  if (!concern) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.emptyText}>気がかりが見つかりません</Text>
      </View>
    );
  }

  const label = getLabel(concern.color);

  const handleSave = () => {
    updateConcernText(concern.id, text);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("削除しますか？", "この気がかりを完全に削除します", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          deleteConcern(concern.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.colorBadge, { backgroundColor: PALETTE[concern.color] }]}>
          <Text style={styles.colorBadgeText}>{label?.name}</Text>
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="気がかりの内容（任意・140字まで）"
          placeholderTextColor={TEXT_SUBTLE}
          maxLength={140}
          style={styles.input}
          accessibilityLabel="気がかりの内容"
          testID="concern-text"
        />
        <Text style={styles.counter}>{text.length} / 140</Text>

        <Text style={styles.sectionTitle}>ステータス</Text>
        <View style={styles.statusRow}>
          {STATUS_CHOICES.map((s) => {
            const active = concern.status === s.key;
            return (
              <Pressable
                key={s.key}
                onPress={() => setConcernStatus(concern.id, s.key)}
                style={({ pressed }) => [
                  styles.statusBtn,
                  active && styles.statusBtnActive,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.statusLabel, active && styles.statusLabelActive]}>
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottom}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.primary, pressed && { opacity: 0.8 }]}
            testID="save-concern"
          >
            <Text style={styles.primaryLabel}>保存して戻る</Text>
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.deleteLabel}>削除</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: BG_BASE, flexGrow: 1 },
  emptyText: { color: TEXT_SUBTLE, fontSize: 14 },
  colorBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 18 },
  colorBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  input: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: BORDER,
    textAlignVertical: "top",
  },
  counter: { textAlign: "right", color: TEXT_SUBTLE, fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 24, marginBottom: 8 },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statusBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: SURFACE,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statusBtnActive: { backgroundColor: ACCENT_PURPLE, borderColor: ACCENT_PURPLE },
  statusLabel: { color: TEXT_PRIMARY, fontSize: 13, fontWeight: "600" },
  statusLabelActive: { color: "#fff" },
  bottom: { marginTop: 32 },
  primary: {
    backgroundColor: ACCENT_PURPLE,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },
  deleteBtn: { alignSelf: "center", marginTop: 18 },
  deleteLabel: { fontSize: 13, color: "#C0392B" },
});
