import React, { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { MOCK_FLIGHTS, Flight } from "@/constants/FlightData";
import { FlightCard } from "@/components/flight-card";
import { AdCard } from "@/components/ad-card";

type SortMode = "cheapest" | "fastest";

interface ListItem {
  type: "flight" | "ad";
  data?: Flight;
  id: string;
}

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    origin: string;
    destination: string;
    date: string;
    originCity: string;
    destinationCity: string;
  }>();

  const [sortMode, setSortMode] = useState<SortMode>("cheapest");

  const sortedFlights = useMemo(() => {
    const flights = [...MOCK_FLIGHTS];
    if (sortMode === "cheapest") {
      flights.sort((a, b) => a.price - b.price);
    } else {
      flights.sort((a, b) => a.duration_minutes - b.duration_minutes);
    }
    return flights;
  }, [sortMode]);

  // Inject ads every 3 flight cards
  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    let adIndex = 0;
    sortedFlights.forEach((flight, index) => {
      items.push({ type: "flight", data: flight, id: flight.id });
      if ((index + 1) % 3 === 0) {
        items.push({ type: "ad", id: `ad-${adIndex}` });
        adIndex++;
      }
    });
    return items;
  }, [sortedFlights]);

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    if (item.type === "ad") {
      return <AdCard index={index} />;
    }
    return <FlightCard flight={item.data!} index={index} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
          backgroundColor: Colors.card,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.background,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 17,
                color: Colors.textPrimary,
              }}
            >
              {params.originCity || params.origin} →{" "}
              {params.destinationCity || params.destination}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 13,
                color: Colors.textSecondary,
                marginTop: 2,
              }}
            >
              {params.date
                ? new Date(params.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )
                : ""}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `${Colors.primary}10`,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 12,
                color: Colors.primary,
              }}
            >
              {MOCK_FLIGHTS.length} flights
            </Text>
          </View>
        </Animated.View>

        {/* Sort pills */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => setSortMode("cheapest")}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                sortMode === "cheapest" ? Colors.primary : Colors.background,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 13,
                color:
                  sortMode === "cheapest" ? "#FFFFFF" : Colors.textSecondary,
              }}
            >
              Cheapest
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSortMode("fastest")}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                sortMode === "fastest" ? Colors.primary : Colors.background,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 13,
                color:
                  sortMode === "fastest" ? "#FFFFFF" : Colors.textSecondary,
              }}
            >
              Fastest
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Flight list */}
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}
