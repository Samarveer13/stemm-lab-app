import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ScreenContainer from "../src/components/ScreenContainer";
import CustomInput from "../src/components/CustomInput";
import { useAuth } from "../src/context/AuthContext";
import { useAccessibility } from "../src/context/AccessibilityContext";

export default function TeamSetupScreen() {
  const router = useRouter();
  const { completeTeamSetup } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [teamName, setTeamName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const years = ["Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9"];

  const isFormComplete =
    teamName.trim() !== "" &&
    studentName.trim() !== "" &&
    selectedYear !== null;

  const t = (size: number) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
  });

  function handleCreate() {
    completeTeamSetup(studentName.trim(), teamName.trim(), selectedYear ?? "");

    router.replace({
      pathname: "/(tabs)",
      params: {
        name: studentName.trim(),
        team: teamName.trim(),
        year: selectedYear ?? "",
      },
    });
  }

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 70,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text
            onPress={() => router.back()}
            style={{ ...t(20), color: colors.primary, marginRight: 10 }}
          >
            ←
          </Text>

          <Text
            style={{ ...t(18), color: colors.primary, fontWeight: "600" }}
          >
            STEMM Lab
          </Text>
        </View>

        <Text
          style={{
            ...t(24),
            fontWeight: "700",
            marginBottom: 8,
            color: colors.textMain,
          }}
        >
          Create Your Team
        </Text>

        <Text
          style={{ ...t(14), color: colors.textSub, marginBottom: 30 }}
        >
          Enter your Team Details
        </Text>

        <View style={{ width: "100%" }}>
          <CustomInput
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />

          <CustomInput
            placeholder="Student Name"
            value={studentName}
            onChangeText={setStudentName}
          />

          <TouchableOpacity
            onPress={() => setOpen(!open)}
            style={{
              backgroundColor: colors.card,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.border,
              paddingVertical: 14,
              paddingHorizontal: 16,
              marginBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                ...t(15),
                color: selectedYear ? colors.textMain : colors.textSub,
              }}
            >
              {selectedYear || "Year Level (e.g. Year 8)"}
            </Text>

            <Text style={{ color: colors.textSub, fontSize: 18 }}>
              {open ? "˄" : "˅"}
            </Text>
          </TouchableOpacity>

          {open && (
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
                overflow: "hidden",
              }}
            >
              {years.map((year, index) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setSelectedYear(year);
                    setOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: index === years.length - 1 ? 0 : 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <Text style={{ ...t(14), color: colors.textMain }}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text
            style={{ ...t(13), color: colors.textSub, marginBottom: 20 }}
          >
            Team ID: Auto Generated
          </Text>

          <TouchableOpacity
            disabled={!isFormComplete}
            onPress={handleCreate}
            style={{
              backgroundColor: isFormComplete ? colors.primary : colors.border,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{ ...t(16), color: "#FFFFFF", fontWeight: "600" }}
            >
              Create Team
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}