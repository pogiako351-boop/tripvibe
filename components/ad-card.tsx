import React from "react";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import Animated, { FadeInDown } from "react-native-reanimated";

interface AdCardProps {
  index: number;
}

export function AdCard({ index }: AdCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400).springify()}
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: `${Colors.warning}30`,
      }}
    >
      {/* Sponsored badge */}
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: `${Colors.warning}15`,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 4,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: 10,
            color: Colors.warning,
            letterSpacing: 0.3,
          }}
        >
          Sponsored
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        {/* Ad image placeholder */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            backgroundColor: `${Colors.primary}10`,
            alignItems: "center",
            justifyContent: "center",
            borderCurve: "continuous",
          }}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/color/96/hotel-building.png",
            }}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>

        {/* Ad content */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 14,
              color: Colors.textPrimary,
              lineHeight: 20,
            }}
          >
            Get 10% off your first hotel booking!
          </Text>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: Colors.textSecondary,
            }}
          >
            Exclusive deals on top-rated stays
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => ({
            backgroundColor: pressed ? Colors.background : Colors.card,
            borderWidth: 1.5,
            borderColor: Colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderCurve: "continuous",
            transform: [{ scale: pressed ? 0.95 : 1 }],
          })}
        >
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 11,
              color: Colors.primary,
            }}
          >
            Learn More
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
