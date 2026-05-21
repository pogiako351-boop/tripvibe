import React from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Flight } from "@/constants/FlightData";
import Animated, { FadeInDown } from "react-native-reanimated";

const airlinePlaceholder = require("@/assets/images/airline-placeholder.png");

// Resolve airline logo: prefer Duffel CDN by IATA code, fall back to provided URL
function getAirlineLogoSource(airlineCode?: string, airlineLogo?: string) {
  if (airlineCode) {
    return {
      uri: `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${airlineCode}.svg`,
    };
  }
  if (airlineLogo) {
    if (airlineLogo.startsWith("//")) return { uri: `https:${airlineLogo}` };
    return { uri: airlineLogo };
  }
  return airlinePlaceholder;
}

interface FlightCardProps {
  flight: Flight;
  index: number;
}

export function FlightCard({ flight, index }: FlightCardProps) {
  const handleBook = () => {
    Linking.openURL(flight.booking_url);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400).springify()}
      style={{
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderCurve: "continuous",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: airline + times */}
        <View style={{ flex: 1, gap: 10 }}>
          {/* Airline */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: Colors.background,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderCurve: "continuous",
              }}
            >
              <Image
                source={getAirlineLogoSource(flight.airline_code, flight.airline_logo)}
                placeholder={airlinePlaceholder}
                placeholderContentFit="contain"
                style={{ width: 36, height: 36 }}
                contentFit="contain"
              />
            </View>
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 12,
                color: Colors.textSecondary,
              }}
            >
              {flight.airline_name}
            </Text>
          </View>

          {/* Times with timeline */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 16,
                color: Colors.textPrimary,
              }}
              selectable
            >
              {flight.departure_time}
            </Text>
            <View style={{ flex: 1, alignItems: "center", gap: 4 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 4,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: Colors.primary,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    height: 1.5,
                    backgroundColor: `${Colors.primary}40`,
                  }}
                />
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 6,
                    borderTopWidth: 4,
                    borderBottomWidth: 4,
                    borderLeftColor: Colors.primary,
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent",
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 11,
                  color: Colors.textMuted,
                }}
              >
                {flight.flight_type} • {flight.duration}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 16,
                color: Colors.textPrimary,
              }}
              selectable
            >
              {flight.arrival_time}
            </Text>
          </View>
        </View>

        {/* Right side: price + CTA */}
        <View style={{ alignItems: "flex-end", marginLeft: 12, gap: 8 }}>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: Colors.textMuted,
              }}
            >
              Price
            </Text>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 20,
                color: Colors.textPrimary,
              }}
              selectable
            >
              ₱{flight.price.toLocaleString()}
            </Text>
          </View>
          <Pressable
            onPress={handleBook}
            style={({ pressed }) => ({
              backgroundColor: pressed ? Colors.accentDark : Colors.accent,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
              borderCurve: "continuous",
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 12,
                color: "#FFFFFF",
              }}
            >
              Book Deal
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
