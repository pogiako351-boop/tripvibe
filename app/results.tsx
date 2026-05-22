import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { MOCK_FLIGHTS, Flight } from "@/constants/FlightData";
import { FlightCard } from "@/components/flight-card";
import { AdCard } from "@/components/ad-card";
import { fetchFlights } from "@/lib/travelpayouts";

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
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFlights() {
      setIsLoading(true);
      setError(null);
      setUsedFallback(false);

      try {
        const origin = params.origin || "";
        const destination = params.destination || "";
        const date = params.date || "";

        if (!origin || !destination || !date) {
          throw new Error("Missing search parameters");
        }

        const results = await fetchFlights(origin, destination, date);

        if (!cancelled) {
          setFlights(results);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(message);
          // Fallback to mock data so UI never shows blank
          setFlights(MOCK_FLIGHTS);
          setUsedFallback(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFlights();

    return () => {
      cancelled = true;
    };
  }, [params.origin, params.destination, params.date]);

  const sortedFlights = useMemo(() => {
    const sorted = [...flights];
    if (sortMode === "cheapest") {
      sorted.sort((a, b) => a.price - b.price);
    } else {
      sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
    }
    return sorted;
  }, [flights, sortMode]);

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
          {!isLoading && (
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
                {flights.length} flights
              </Text>
            </View>
          )}
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

      {/* Loading State */}
      {isLoading && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 40,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 15,
              color: Colors.textSecondary,
              textAlign: "center",
            }}
          >
            Searching for the best deals...
          </Text>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 13,
              color: Colors.textMuted,
              textAlign: "center",
            }}
          >
            {params.originCity || params.origin} →{" "}
            {params.destinationCity || params.destination}
          </Text>
        </View>
      )}

      {/* Error Banner (shown above results when using fallback) */}
      {!isLoading && error && usedFallback && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            marginHorizontal: 16,
            marginTop: 12,
            backgroundColor: "#FEF3C7",
            borderRadius: 12,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderCurve: "continuous",
          }}
        >
          <Ionicons name="information-circle" size={20} color="#D97706" />
          <View style={{ flex: 1 }}>
            <Text
              selectable
              style={{
                fontFamily: Fonts.medium,
                fontSize: 13,
                color: "#92400E",
              }}
            >
              No flights found. Please try a different route or date.
            </Text>
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: "#B45309",
                marginTop: 2,
              }}
            >
              Showing sample results below
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setError(null);
              setUsedFallback(false);
            }}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color="#92400E" />
          </Pressable>
        </Animated.View>
      )}

      {/* Flight list */}
      {!isLoading && (
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
      )}
    </View>
  );
}
