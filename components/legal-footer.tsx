import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";

type LegalContent = {
  title: string;
  body: string;
};

const LEGAL_CONTENT: Record<string, LegalContent> = {
  affiliate: {
    title: "Affiliate Disclosure",
    body: "TripVibe is an independent flight comparison service. We may earn a commission when you book flights through links on our platform. This comes at no extra cost to you.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "We value your privacy. We use industry-standard cookies to track booking referrals to our travel partners. We do not sell your personal data.",
  },
  terms: {
    title: "Terms of Service",
    body: "TripVibe is a search and comparison tool. We do not provide travel services directly. All bookings are subject to the terms and conditions of the respective airline or travel agency.",
  },
};

export function LegalFooter() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;

  const modalContent = activeModal ? LEGAL_CONTENT[activeModal] : null;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 16,
          flexWrap: "wrap",
          gap: isNarrow ? 4 : 0,
        }}
      >
        <Pressable
          onPress={() => setActiveModal("privacy")}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 12,
              color: Colors.textSecondary,
            }}
          >
            Privacy Policy
          </Text>
        </Pressable>

        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 12,
            color: Colors.textMuted,
            marginHorizontal: 8,
          }}
        >
          ·
        </Text>

        <Pressable
          onPress={() => setActiveModal("terms")}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 12,
              color: Colors.textSecondary,
            }}
          >
            Terms of Service
          </Text>
        </Pressable>

        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 12,
            color: Colors.textMuted,
            marginHorizontal: 8,
          }}
        >
          ·
        </Text>

        <Pressable
          onPress={() => setActiveModal("affiliate")}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 12,
              color: Colors.textSecondary,
            }}
          >
            Affiliate Disclosure
          </Text>
        </Pressable>
      </View>

      {/* Legal Modal */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
        statusBarTranslucent
      >
        <Pressable
          onPress={() => setActiveModal(null)}
          style={{
            flex: 1,
            backgroundColor: Colors.overlay,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: Colors.card,
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 24,
              width: "100%",
              maxWidth: 380,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            {modalContent && (
              <Animated.View entering={FadeIn.duration(200)}>
                {/* Modal Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text
                    selectable
                    style={{
                      fontFamily: Fonts.bold,
                      fontSize: 18,
                      color: Colors.textPrimary,
                      flex: 1,
                    }}
                  >
                    {modalContent.title}
                  </Text>
                  <Pressable
                    onPress={() => setActiveModal(null)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={({ pressed }) => ({
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: Colors.background,
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Ionicons name="close" size={18} color={Colors.textSecondary} />
                  </Pressable>
                </View>

                {/* Divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: Colors.border,
                    marginBottom: 16,
                  }}
                />

                {/* Modal Body */}
                <Text
                  selectable
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 15,
                    color: Colors.textSecondary,
                    lineHeight: 24,
                  }}
                >
                  {modalContent.body}
                </Text>

                {/* Dismiss Button */}
                <Pressable
                  onPress={() => setActiveModal(null)}
                  style={({ pressed }) => ({
                    marginTop: 24,
                    backgroundColor: pressed ? Colors.primaryDark : Colors.primary,
                    borderRadius: 12,
                    borderCurve: "continuous",
                    paddingVertical: 12,
                    alignItems: "center",
                  })}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.semiBold,
                      fontSize: 14,
                      color: "#FFFFFF",
                    }}
                  >
                    Got it
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
