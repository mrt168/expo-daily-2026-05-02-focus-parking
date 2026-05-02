import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useConcerns } from "../context/ConcernContext";
import { ACCENT_PURPLE, BG_BASE, TEXT_PRIMARY, TEXT_SUBTLE, PALETTE } from "../constants/colors";

const { width } = Dimensions.get("window");

const PAGES = [
  {
    emoji: "🅿️",
    title: "気がかりを駐車する",
    body: "頭の中のもやもやを、書かなくても色で駐車。3秒で頭がスッキリします。",
  },
  {
    emoji: "🎨",
    title: "5色の駐車エリア",
    body: "緊急度・対応者などで色を使い分け。後から仕分けて気軽に手放しましょう。",
  },
  {
    emoji: "📊",
    title: "手放した数が見える",
    body: "気がかりが頭から消えた数を可視化。週次レポートでメンタル余白を実感できます。",
  },
];

export default function Onboarding() {
  const [page, setPage] = useState(0);
  const router = useRouter();
  const { completeOnboarding } = useConcerns();

  const handleNext = () => {
    if (page < PAGES.length - 1) setPage(page + 1);
    else {
      completeOnboarding();
      router.replace("/");
    }
  };

  const cur = PAGES[page];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{cur.emoji}</Text>
        <Text style={styles.title}>{cur.title}</Text>
        <Text style={styles.body}>{cur.body}</Text>
      </View>

      <View style={styles.dots}>
        {PAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>

      <Pressable
        onPress={handleNext}
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
        testID="onboarding-next"
      >
        <Text style={styles.btnLabel}>{page < PAGES.length - 1 ? "次へ" : "はじめる"}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE, padding: 24 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "800", color: TEXT_PRIMARY, textAlign: "center" },
  body: { fontSize: 15, color: TEXT_SUBTLE, marginTop: 16, textAlign: "center", lineHeight: 22 },
  dots: { flexDirection: "row", justifyContent: "center", marginVertical: 16, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D6D1C7" },
  dotActive: { backgroundColor: ACCENT_PURPLE, width: 24 },
  btn: {
    backgroundColor: ACCENT_PURPLE,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  btnLabel: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
