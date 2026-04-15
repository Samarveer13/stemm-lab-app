import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import ScreenContainer from "../../src/components/ScreenContainer";

type ActivityItem = {
  title: string;
  category: string;
  group: string;
  route: string;
};

export default function ActivitiesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");

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
      route: "/activities/handFan",
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
            textAlign: "center",
            fontSize: 18,
            color: "#3B82F6",
            fontWeight: "600",
            marginBottom: 30,
          }}
        >
          STEMM Lab
        </Text>

        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "700",
            color: "#1F2937",
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
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
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
                    selectedFilter === filter ? "#EFF6FF" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: selectedFilter === filter ? "600" : "500",
                    color: selectedFilter === filter ? "#3B82F6" : "#9CA3AF",
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
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#E5E7EB",
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
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#4B5563",
                  marginBottom: 4,
                }}
              >
                {activity.title}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: "#9CA3AF",
                }}
              >
                {activity.category}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(activity.route as any)}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Start
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}