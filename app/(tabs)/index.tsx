import React from "react";
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { ColorButton } from "../../components/ColorButton";
import { useConcerns } from "../../context/ConcernContext";
import { COLOR_ORDER } from "../../types";
import { BG_BASE, TEXT_PRIMARY, TEXT_SUBTLE } from "../../constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { addConcern, getLabel, parkedCount } = useConcerns();

  const handlePark = (color: (typeof COLOR_ORDER)[number]) => {
    const concern = addConcern(color);
    router.push({ pathname: "/concern/[id]", params: { id: concern.id } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>気がかりを駐車しよう</Text>
        <Text style={styles.sub}>
          現在 {parkedCount} 件が駐車中。色を選ぶだけで、頭の中のもやもやを書き留めず手放せます。
        </Text>
        <View style={styles.list}>
          {COLOR_ORDER.map((color) => {
            const label = getLabel(color);
            return (
              <ColorButton
                key={color}
                color={color}
                label={label?.name ?? color}
                onPress={() => handlePark(color)}
                testID={`park-${color}`}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG_BASE },
  container: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 24, fontWeight: "700", color: TEXT_PRIMARY, marginTop: 8 },
  sub: { fontSize: 13, color: TEXT_SUBTLE, marginTop: 8, lineHeight: 20 },
  list: { marginTop: 18 },
});
