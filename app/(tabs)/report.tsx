import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, SafeAreaView } from "react-native";
import ViewShot from "react-native-view-shot";
import { useConcerns } from "../../context/ConcernContext";
import { BG_BASE, ACCENT_PURPLE, TEXT_PRIMARY, TEXT_SUBTLE, SURFACE, BORDER } from "../../constants/colors";
import { BigNumber } from "../../components/BigNumber";
import { HeatmapGrid } from "../../components/HeatmapGrid";
import { ShareCard } from "../../components/ShareCard";
import { captureAndShare } from "../../utils/shareCard";

export default function ReportScreen() {
  const { releasedCount, doneCount, dismissedCount, parkedCount, weeklyMatrix } = useConcerns();
  const shotRef = useRef<ViewShot>(null);

  const handleShare = () => captureAndShare(shotRef);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>レポート</Text>
        <Text style={styles.sub}>気がかりが頭から消えた数を見える化します</Text>

        <View style={styles.row}>
          <View style={styles.flex}>
            <BigNumber value={releasedCount} label="手放した気がかり" />
          </View>
          <View style={styles.gap} />
          <View style={styles.flex}>
            <BigNumber value={doneCount} label="対応済み" />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.flex}>
            <BigNumber value={parkedCount} label="駐車中" />
          </View>
          <View style={styles.gap} />
          <View style={styles.flex}>
            <BigNumber value={dismissedCount} label="気にしない" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>過去7日間の駐車ヒートマップ</Text>
        <HeatmapGrid matrix={weeklyMatrix} />

        <Pressable
          onPress={handleShare}
          style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.8 }]}
          accessibilityLabel="レポートを共有する"
          testID="share-report"
        >
          <Text style={styles.shareLabel}>📤 SNSで共有</Text>
        </Pressable>

        <View style={{ height: 1, overflow: "hidden", opacity: 0 }}>
          <ViewShot ref={shotRef} options={{ format: "png", quality: 1, result: "tmpfile" }}>
            <ShareCard
              releasedCount={releasedCount}
              parkedCount={parkedCount}
              matrix={weeklyMatrix}
            />
          </ViewShot>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: "700", color: TEXT_PRIMARY },
  sub: { fontSize: 13, color: TEXT_SUBTLE, marginTop: 6, marginBottom: 18 },
  row: { flexDirection: "row", marginBottom: 12 },
  flex: { flex: 1 },
  gap: { width: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 18, marginBottom: 10 },
  shareBtn: {
    marginTop: 24,
    backgroundColor: ACCENT_PURPLE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  shareLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
