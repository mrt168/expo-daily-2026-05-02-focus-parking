import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useConcerns } from "../../context/ConcernContext";
import { COLOR_ORDER } from "../../types";
import { BG_BASE, PALETTE, TEXT_PRIMARY, TEXT_SUBTLE } from "../../constants/colors";
import { ConcernCard } from "../../components/ConcernCard";

export default function ListScreen() {
  const router = useRouter();
  const { concerns, getLabel } = useConcerns();

  const grouped = useMemo(() => {
    return COLOR_ORDER.map((color) => ({
      color,
      label: getLabel(color),
      items: concerns.filter((c) => c.color === color && c.status === "parked"),
    }));
  }, [concerns, getLabel]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>駐車中の気がかり</Text>
        {grouped.map(({ color, label, items }) => (
          <View key={color} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.dot, { backgroundColor: PALETTE[color] }]} />
              <Text style={styles.sectionTitle}>{label?.name}</Text>
              <Text style={styles.sectionCount}>{items.length}件</Text>
            </View>
            {items.length === 0 ? (
              <Text style={styles.empty}>このエリアは空っぽです</Text>
            ) : (
              items.map((c) => (
                <ConcernCard
                  key={c.id}
                  concern={c}
                  onPress={() => router.push({ pathname: "/concern/[id]", params: { id: c.id } })}
                />
              ))
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: TEXT_PRIMARY, marginBottom: 12 },
  section: { marginBottom: 18 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: TEXT_PRIMARY },
  sectionCount: { marginLeft: "auto", fontSize: 12, color: TEXT_SUBTLE },
  empty: { fontSize: 12, color: TEXT_SUBTLE, paddingVertical: 8 },
});
