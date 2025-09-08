import InitialLayout from "@/components/InitialLayout";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
