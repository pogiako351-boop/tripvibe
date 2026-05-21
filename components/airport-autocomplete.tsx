import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Typography";
import { Airport, searchAirports } from "@/constants/Airports";

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onSelect: (airport: Airport) => void;
  icon: keyof typeof Ionicons.glyphMap;
}

export function AirportAutocomplete({
  label,
  placeholder,
  value,
  onSelect,
  icon,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChange = useCallback((text: string) => {
    setQuery(text);
    const matches = searchAirports(text);
    setResults(matches);
    setShowDropdown(matches.length > 0);
  }, []);

  const handleSelect = useCallback(
    (airport: Airport) => {
      setQuery(airport.city);
      setShowDropdown(false);
      onSelect(airport);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const handleFocus = useCallback(() => {
    if (query) {
      const matches = searchAirports(query);
      setResults(matches);
      setShowDropdown(matches.length > 0);
    }
  }, [query]);

  return (
    <View style={{ zIndex: showDropdown ? 100 : 1 }}>
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 12,
          color: Colors.textSecondary,
          marginBottom: 6,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.background,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          gap: 10,
          borderWidth: 1.5,
          borderColor: showDropdown ? Colors.primary : "transparent",
        }}
      >
        <Ionicons name={icon} size={18} color={Colors.primary} />
        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            fontFamily: Fonts.medium,
            fontSize: 15,
            color: Colors.textPrimary,
          }}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </View>

      {showDropdown && (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: Colors.card,
            borderRadius: 12,
            marginTop: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <ScrollView
            style={{ maxHeight: 200, flexGrow: 0 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {results.map((airport) => (
              <Pressable
                key={airport.code}
                onPress={() => handleSelect(airport)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: pressed
                    ? Colors.background
                    : "transparent",
                  gap: 10,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: `${Colors.primary}15`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.bold,
                      fontSize: 11,
                      color: Colors.primary,
                    }}
                  >
                    {airport.code}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.semiBold,
                      fontSize: 14,
                      color: Colors.textPrimary,
                    }}
                  >
                    {airport.city}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.regular,
                      fontSize: 12,
                      color: Colors.textSecondary,
                    }}
                  >
                    {airport.code} - {airport.city}, {airport.country}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
