import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ConcernProvider, useConcerns } from "../context/ConcernContext";
import { BG_BASE } from "../constants/colors";

function NavigationGate() {
  const { hydrated, settings } = useConcerns();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    const inOnboarding = segments[0] === "onboarding";
    if (!settings.hasCompletedOnboarding && !inOnboarding) {
      router.replace("/onboarding");
    }
  }, [hydrated, settings.hasCompletedOnboarding, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BG_BASE } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen
        name="concern/[id]"
        options={{ presentation: "modal", headerShown: true, title: "気がかりの詳細" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConcernProvider>
        <StatusBar style="dark" />
        <NavigationGate />
      </ConcernProvider>
    </GestureHandlerRootView>
  );
}
