import { Text, View, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ScreenContainer from "../src/components/ScreenContainer";
import { useAuth } from "../src/context/AuthContext";
import { useAccessibility } from "../src/context/AccessibilityContext";

const MEMBER_LABELS = ["Member 1", "Member 2", "Member 3", "Member 4"];
const YEAR_LEVELS = ["Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9"];

export default function TeamSetupScreen() {
  const router = useRouter();
  const { completeTeamSetup } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["", "", "", ""]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = (size: number) => ({ fontSize: size + (fontSize - 14), fontFamily });

  const updateMember = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const isFormComplete = teamName.trim() !== "" && members[0].trim() !== "" && selectedYear !== null;

  async function handleCreate() {
    setError("");
    setSaving(true);
    try {
      const filledMembers = members.filter((m) => m.trim() !== "");
      await completeTeamSetup(teamName.trim(), filledMembers, selectedYear ?? "");
      router.replace("/(tabs)");
    } catch {
      setError("Failed to create team. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 40 }}>
          <Text onPress={() => router.back()} style={{ ...t(20), color: colors.primary, marginRight: 10 }}>
            ←
          </Text>
          <Text style={{ ...t(18), color: colors.primary, fontWeight: "600" }}>STEMM Lab</Text>
        </View>

        <Text style={{ ...t(24), fontWeight: "700", marginBottom: 6, color: colors.textMain }}>
          Create Your Team
        </Text>
        <Text style={{ ...t(14), color: colors.textSub, marginBottom: 28 }}>
          Enter team name and up to 4 member names
        </Text>

        {!!error && (
          <View style={{ borderWidth: 1, borderColor: "#F87171", backgroundColor: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <Text style={{ color: "#DC2626", ...t(13) }}>{error}</Text>
          </View>
        )}

        <Text style={{ ...t(12), fontWeight: "600", color: colors.textSub, marginBottom: 6, marginLeft: 2 }}>
          Team Name *
        </Text>
        <TextInput
          value={teamName}
          onChangeText={setTeamName}
          placeholder="e.g. Team Rocket"
          placeholderTextColor={colors.textSub}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: 12,
            paddingVertical: 13,
            paddingHorizontal: 16,
            marginBottom: 20,
            color: colors.textMain,
            ...t(15),
          }}
        />

        <Text style={{ ...t(13), fontWeight: "600", color: colors.textMain, marginBottom: 12 }}>
          Team Members
        </Text>

        {MEMBER_LABELS.map((label, i) => (
          <View key={i}>
            <Text style={{ ...t(12), fontWeight: "600", color: colors.textSub, marginBottom: 6, marginLeft: 2 }}>
              {label}{i === 0 ? " *" : " (optional)"}
            </Text>
            <TextInput
              value={members[i]}
              onChangeText={(v) => updateMember(i, v)}
              placeholder={`e.g. Alex Johnson`}
              placeholderTextColor={colors.textSub}
              style={{
                backgroundColor: colors.card,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
                paddingVertical: 13,
                paddingHorizontal: 16,
                marginBottom: 14,
                color: colors.textMain,
                ...t(15),
              }}
            />
          </View>
        ))}

        <Text style={{ ...t(12), fontWeight: "600", color: colors.textSub, marginBottom: 6, marginLeft: 2 }}>
          Year Level *
        </Text>
        <TouchableOpacity
          onPress={() => setYearOpen(!yearOpen)}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: 12,
            paddingVertical: 13,
            paddingHorizontal: 16,
            marginBottom: yearOpen ? 0 : 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ ...t(15), color: selectedYear ? colors.textMain : colors.textSub }}>
            {selectedYear || "Select year level"}
          </Text>
          <Text style={{ color: colors.textSub, fontSize: 16 }}>{yearOpen ? "˄" : "˅"}</Text>
        </TouchableOpacity>

        {yearOpen && (
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 20,
            overflow: "hidden",
          }}>
            {YEAR_LEVELS.map((year, index) => (
              <TouchableOpacity
                key={year}
                onPress={() => { setSelectedYear(year); setYearOpen(false); }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: index === YEAR_LEVELS.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ ...t(14), color: colors.textMain }}>{year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={{ ...t(13), color: colors.textSub, marginBottom: 24, marginTop: 4 }}>
          Team ID will be auto-generated after creation
        </Text>

        <TouchableOpacity
          disabled={!isFormComplete || saving}
          onPress={handleCreate}
          style={{
            backgroundColor: isFormComplete && !saving ? colors.primary : colors.border,
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ ...t(16), color: "#FFFFFF", fontWeight: "600" }}>
              Create Team
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
