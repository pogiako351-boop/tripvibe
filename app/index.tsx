import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Airport } from "@/constants/Airports";
import { AirportAutocomplete } from "@/components/airport-autocomplete";
import { supabase } from "@/lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";

const isWeb = Platform.OS === "web";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSearch = useCallback(async () => {
    setError(null);

    if (!origin) {
      setError("Please select an origin airport");
      return;
    }
    if (!destination) {
      setError("Please select a destination airport");
      return;
    }
    if (origin.code === destination.code) {
      setError("Origin and destination cannot be the same");
      return;
    }

    setIsSearching(true);

    // Log search to Supabase
    try {
      await supabase.from("search_logs").insert({
        origin_code: origin.code,
        destination_code: destination.code,
        travel_date: date.toISOString().split("T")[0],
      });
    } catch (e) {
      // Non-blocking: don't prevent search if logging fails
      console.warn("Search log failed:", e);
    }

    // Navigate to results
    router.push({
      pathname: "/results",
      params: {
        origin: origin.code,
        destination: destination.code,
        date: date.toISOString().split("T")[0],
        originCity: origin.city,
        destinationCity: destination.city,
      },
    });

    setIsSearching(false);
  }, [origin, destination, date, router]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Gradient Hero Background */}
      <LinearGradient
        colors={["#4A3FBF", "#6C63FF", "#9B8FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "65%",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Branding */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={{ alignItems: "center", marginBottom: 32 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <Ionicons name="airplane" size={28} color="#FFFFFF" />
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 32,
                color: "#FFFFFF",
                letterSpacing: -0.5,
              }}
            >
              TripVibe
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 0.2,
            }}
          >
            Find your next adventure
          </Text>
        </Animated.View>

        {/* Search Card */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={{
            backgroundColor: Colors.card,
            borderRadius: 20,
            padding: 20,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            borderCurve: "continuous",
            gap: 16,
          }}
        >
          {/* Origin Input */}
          <View style={{ zIndex: 30 }}>
            <AirportAutocomplete
              label="Origin"
              placeholder="Where from?"
              value={origin?.city || ""}
              onSelect={setOrigin}
              icon="location-outline"
            />
          </View>

          {/* Divider with swap icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              zIndex: 1,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: Colors.border }}
            />
            <Pressable
              onPress={() => {
                if (origin && destination) {
                  const temp = origin;
                  setOrigin(destination);
                  setDestination(temp);
                }
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${Colors.primary}10`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="swap-vertical"
                size={16}
                color={Colors.primary}
              />
            </Pressable>
            <View
              style={{ flex: 1, height: 1, backgroundColor: Colors.border }}
            />
          </View>

          {/* Destination Input */}
          <View style={{ zIndex: 20 }}>
            <AirportAutocomplete
              label="Destination"
              placeholder="Where to?"
              value={destination?.city || ""}
              onSelect={setDestination}
              icon="navigate-outline"
            />
          </View>

          {/* Date Picker */}
          <View style={{ zIndex: 10 }}>
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 12,
                color: Colors.textSecondary,
                marginBottom: 6,
                letterSpacing: 0.3,
              }}
            >
              Departure Date
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.background,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                gap: 10,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.primary}
              />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 15,
                  color: Colors.textPrimary,
                }}
              >
                {formatDate(date)}
              </Text>
            </Pressable>

            {showDatePicker && !isWeb && (
              <View style={{ marginTop: 8 }}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                  themeVariant="light"
                />
                {Platform.OS === "ios" && (
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    style={{
                      alignSelf: "flex-end",
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.semiBold,
                        fontSize: 14,
                        color: Colors.primary,
                      }}
                    >
                      Done
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            {showDatePicker && isWeb && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: Colors.card,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
              >
                <input
                  type="date"
                  value={date.toISOString().split("T")[0]}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newDate = new Date(e.target.value + "T00:00:00");
                    if (!isNaN(newDate.getTime())) {
                      setDate(newDate);
                    }
                    setShowDatePicker(false);
                  }}
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 15,
                    border: "none",
                    outline: "none",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    color: Colors.textPrimary,
                    backgroundColor: "transparent",
                  }}
                />
              </View>
            )}
          </View>

          {/* Error message */}
          {error && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text
                selectable
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: Colors.accent,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            </Animated.View>
          )}

          {/* Search Button */}
          <Animated.View style={animatedButtonStyle}>
            <Pressable
              onPress={handleSearch}
              onPressIn={() => {
                buttonScale.value = withSpring(0.96);
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1);
              }}
              disabled={isSearching}
              style={{
                backgroundColor: Colors.accent,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                opacity: isSearching ? 0.7 : 1,
                borderCurve: "continuous",
              }}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: 16,
                  color: "#FFFFFF",
                  letterSpacing: 0.3,
                }}
              >
                {isSearching ? "Searching..." : "Search Flights"}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* Bottom decorative elements */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={{
            marginTop: 32,
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  color: Colors.textSecondary,
                }}
              >
                Best Price Guarantee
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="flash" size={16} color={Colors.warning} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 12,
                  color: Colors.textSecondary,
                }}
              >
                Instant Booking
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
