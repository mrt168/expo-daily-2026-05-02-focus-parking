import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { RefObject } from "react";

export async function captureAndShare(ref: RefObject<ViewShot | null>): Promise<void> {
  if (!ref.current) {
    Alert.alert("共有", "カードの取得に失敗しました");
    return;
  }
  try {
    const uri = await ref.current.capture?.();
    if (!uri) throw new Error("Capture returned no URI");
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("共有", "この端末では共有が利用できません");
      return;
    }
    await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "気がかりレポートを共有" });
  } catch (e) {
    Alert.alert("共有エラー", e instanceof Error ? e.message : String(e));
  }
}
