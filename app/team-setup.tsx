import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import ScreenContainer from "../src/components/ScreenContainer";
import CustomButton from "../src/components/CustomButton";
import CustomInput from "../src/components/CustomInput";

export default function TeamSetupScreen() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const years = ["Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9"];

  const isFormComplete =
    teamName.trim() !== "" &&
    studentName.trim() !== "" &&
    selectedYear !== null;

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
            style={{
              fontSize: 20,
              color: "#3B82F6",
              marginRight: 10,
            }}
          >
            ←
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "#3B82F6",
              fontWeight: "600",
            }}
          >
            STEMM Lab
          </Text>
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 8,
            color: "#1F2937",
          }}
        >
          Create Your Team
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginBottom: 30,
          }}
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
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: "#D1D5DB",
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
                color: selectedYear ? "#111827" : "#9CA3AF",
                fontSize: 15,
              }}
            >
              {selectedYear || "Year Level (e.g. Year 8)"}
            </Text>

            <Text style={{ color: "#9CA3AF", fontSize: 18 }}>
              {open ? "˄" : "˅"}
            </Text>
          </TouchableOpacity>

          {open && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
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
                    borderBottomColor: "#F3F4F6",
                  }}
                >
                  <Text style={{ color: "#111827" }}>{year}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            Team ID: Auto Generated
          </Text>

          <TouchableOpacity
            disabled={!isFormComplete}
            onPress={() =>
              router.replace({
                pathname: "/(tabs)",
                params: { name: studentName },
              })
            }
            style={{
              backgroundColor: isFormComplete ? "#3B82F6" : "#BFDBFE",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Create Team
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}