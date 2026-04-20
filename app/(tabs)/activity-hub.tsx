import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import { useAccessibility } from "../../src/context/AccessibilityContext";

type ActivityItem = {
  title: string;
  category: string;
  group: string;
  route: string;
};

export default function ActivitiesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { colors, fontSize, fontFamily } = useAccessibility();

  const text = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  const filters = ["All", "Physics", "Engineering", "Environmental", "Health"];

  const activities: ActivityItem[] = [
    {
      title: "Parachute Drop Challenge",
      category: "Engineering + Physics",
      group: "Engineering",
      route: "/activities/parachute",
    },
    {
      title: "Sound Pollution Hunter",
      category: "Environmental Science",
      group: "Environmental",
      route: "/activities/sound",
    },
    {
      title: "Hand Fan Challenge",
      category: "Physics",
      group: "Physics",
      route: "/activities/handfan",
    },
    {
      title: "Earthquake-Resistant Structure",
      category: "Engineering + Earth Science",
      group: "Engineering",
      route: "/activities/earthquake",
    },
    {
      title: "Human Performance Lab",
      category: "Medical Science + Biomechanics",
      group: "Health",
      route: "/activities/performance",
    },
    {
      title: "Reaction Board Challenge",
      category: "Neuroscience + Mathematics",
      group: "Health",
      route: "/activities/reaction",
    },
    {
      title: "Breathing Pace Trainer",
      category: "Medical Science",
      group: "Health",
      route: "/activities/breathing",
    },
  ];

  const filteredActivities =
    selectedFilter === "All"
      ? activities
      : activities.filter(
          (activity) =>
            activity.group === selectedFilter ||
            activity.category.includes(selectedFilter)
        );

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 70,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            ...text(18),
            textAlign: "center",
            color: colors.primary,
            fontWeight: "600",
            marginBottom: 30,
          }}
        >
          STEMM Lab
        </Text>

        <Text
          style={{
            ...text(24),
            textAlign: "center",
            fontWeight: "700",
            color: colors.textMain,
            marginBottom: 18,
          }}
        >
          STEMM Activities
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          style={{ marginBottom: 20 }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 4,
            }}
          >
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  marginRight: index === filters.length - 1 ? 0 : 6,
                  backgroundColor:
                    selectedFilter === filter ? colors.primarySelected : "transparent",
                }}
              >
                <Text
                  style={{
                    ...text(13),
                    fontWeight: selectedFilter === filter ? "600" : "500",
                    color: selectedFilter === filter ? colors.primary : colors.textSub,
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredActivities.map((activity) => (
          <View
            key={activity.title}
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              paddingVertical: 14,
              paddingHorizontal: 14,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                style={{
                  ...text(16),
                  fontWeight: "600",
                  color: colors.textMain,
                  marginBottom: 4,
                }}
              >
                {activity.title}
              </Text>

              <Text style={{ ...text(13), color: colors.textSub }}>
                {activity.category}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(activity.route as any)}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ ...text(14), color: "#FFFFFF", fontWeight: "600" }}>
                Start
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
