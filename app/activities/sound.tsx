// app/activities/sound.tsx


import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import ActivitySubmitCard from "../../src/components/ActivitySubmitCard";
import { requestMicrophoneAccess } from "../../src/services/microphoneService";

// NOTE: For real dB measurement install expo-av:
//   npx expo install expo-av
// Then replace the simulated reading with Audio.Recording API.
// The UI below is wired for real sensor data when available.

const TAB_LABELS = ["Overview", "Instructions", "Measure", "Science"];

type SoundAction = {
  label: string;
  prediction: string;
  outcome: string;
  correct: string;
};

const DB_TABLE = [
  { range: "0–30 dB", example: "Whisper, quiet library", risk: "No risk", color: "#10B981" },
  { range: "30–60 dB", example: "Normal conversation", risk: "Safe", color: "#10B981" },
  { range: "60–85 dB", example: "Vacuum cleaner, traffic", risk: "Generally safe", color: "#F59E0B" },
  { range: "85–90 dB", example: "Lawn mower", risk: "Damage possible", color: "#F97316" },
  { range: "90–100 dB", example: "Motorbike, power tools", risk: "Damage likely", color: "#EF4444" },
  { range: "100–110 dB", example: "Rock concert, chainsaw", risk: "Serious damage", color: "#DC2626" },
  { range: "110–120 dB", example: "Siren close by", risk: "Immediate damage", color: "#B91C1C" },
  { range: "120+ dB", example: "Jet engine", risk: "Severe damage", color: "#7F1D1D" },
];

export default function SoundScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // Simulated dB meter state
  const [isRecording, setIsRecording] = useState(false);
  const [currentDB, setCurrentDB] = useState<number | null>(null);
  const [peakDB, setPeakDB] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Results
  const [actions, setActions] = useState<SoundAction[]>([
    { label: "Action 1 (e.g. dropping a book)", prediction: "", outcome: "", correct: "" },
    { label: "Action 2 (e.g. talking loudly)", prediction: "", outcome: "", correct: "" },
    { label: "Action 3 (e.g. stamping feet)", prediction: "", outcome: "", correct: "" },
  ]);

  const startSimulation = async () => {
  const granted = await requestMicrophoneAccess();

  if (!granted) {
    Alert.alert(
      "Permission Needed",
      "Please allow microphone access."
    );
    return;
  }

  setIsRecording(true);
  setPeakDB(null);

  intervalRef.current = setInterval(() => {
    // Simulated microphone dB readings
    const simDB = Math.round(40 + Math.random() * 50);

    setCurrentDB(simDB);

    setPeakDB((prev) =>
      prev === null ? simDB : Math.max(prev, simDB)
    );
  }, 300);
};

  const stopSimulation = () => {
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const logReading = () => {
    if (currentDB === null) return;
    Alert.alert(
      "Save Reading",
      `Save ${currentDB} dB to which action?`,
      actions.map((a, i) => ({
        text: a.label.slice(0, 25),
        onPress: () => {
          const updated = [...actions];
          updated[i].outcome = `${currentDB} dB`;
          setActions(updated);
          stopSimulation();
        },
      }))
    );
  };

  const getDbColor = (db: number) => {
    if (db < 60) return "#10B981";
    if (db < 85) return "#F59E0B";
    if (db < 100) return "#F97316";
    return "#EF4444";
  };

  const updateAction = (i: number, field: keyof SoundAction, value: string) => {
    const updated = [...actions];
    updated[i] = { ...updated[i], [field]: value };
    setActions(updated);
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: "#3B82F6" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>🔊 Sound Pollution Hunter</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Environmental Science</Text>
      </View>

      {/* Tab Bar */}
      <View style={{ flexDirection: "row", paddingHorizontal: 20, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
        {TAB_LABELS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(i)}
            style={{ marginRight: 20, paddingBottom: 10, borderBottomWidth: activeTab === i ? 2 : 0, borderBottomColor: "#3B82F6" }}
          >
            <Text style={{ fontSize: 14, fontWeight: activeTab === i ? "600" : "400", color: activeTab === i ? "#3B82F6" : "#9CA3AF" }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── OVERVIEW ── */}
        {activeTab === 0 && (
          <View>
            <Card>
              <Title>Overview</Title>
              <Body>Students measure and compare sound levels in different classroom activities, then map loud and quiet zones to understand sound pollution.</Body>
            </Card>
            <Card>
              <Title>Equipment Needed</Title>
              {["Mobile phone with STEMM Lab app"].map((e) => (
                <BulletRow key={e} text={e} />
              ))}
            </Card>
            <Card>
              <Title>Write-Up Prompts</Title>
              {[
                "Predict which action created the loudest sound.",
                "Record the results in decibels (dB).",
                "Were you right? Any surprises?",
                "Should we wear ear muffs in your classroom?",
              ].map((p) => <BulletRow key={p} text={p} bullet="›" />)}
            </Card>
          </View>
        )}

        {/* ── INSTRUCTIONS ── */}
        {activeTab === 1 && (
          <View>
            <Card>
              <Title>Step-by-Step Instructions</Title>
              <Image
      source={require("../../assets/images/sound.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
              {[
                "Open the Measure tab and tap Start.",
                "Perform Action 1 (e.g. drop a book on the table) and observe the dB reading.",
                "Tap Log Reading to save to an action slot.",
                "Repeat for Actions 2 and 3.",
                "Record sound levels and locations on paper.",
                "Map loud and quiet zones in your classroom.",
              ].map((step, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{step}</Text>
                </View>
              ))}
            </Card>
            <Card>
              <Title>Actions to Test</Title>
              {["Dropping objects (pens, books)", "Talking loudly", "Walking normally", "Stamping your feet", "Scraping a chair"].map((a) => (
                <BulletRow key={a} text={a} />
              ))}
            </Card>
          </View>
        )}

        {/* ── MEASURE TAB ── */}
        {activeTab === 2 && (
          <View>
            {/* dB Meter */}
            <Card>
              <Title>🎙 Sound Level Meter</Title>
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <Text style={{ fontSize: 64, fontWeight: "800", color: currentDB ? getDbColor(currentDB) : "#D1D5DB" }}>
                  {currentDB !== null ? `${currentDB}` : "--"}
                </Text>
                <Text style={{ fontSize: 18, color: "#9CA3AF", marginTop: -4 }}>dB</Text>
                {peakDB !== null && (
                  <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Peak: {peakDB} dB</Text>
                )}
                {/* Simple bar */}
                <View style={{ width: "90%", height: 12, backgroundColor: "#F3F4F6", borderRadius: 6, marginTop: 16, overflow: "hidden" }}>
                  <View
                    style={{
                      width: `${Math.min(100, ((currentDB ?? 0) / 130) * 100)}%`,
                      height: "100%",
                      backgroundColor: currentDB ? getDbColor(currentDB) : "#D1D5DB",
                      borderRadius: 6,
                    }}
                  />
                </View>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  0 dB ──────────────────── 130 dB
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                {!isRecording ? (
                  <TouchableOpacity
                    onPress={startSimulation}
                    style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>▶ Start</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={stopSimulation}
                    style={{ flex: 1, backgroundColor: "#EF4444", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>⏹ Stop</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={logReading}
                  disabled={currentDB === null}
                  style={{ flex: 1, backgroundColor: currentDB !== null ? "#10B981" : "#D1D5DB", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>💾 Log Reading</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
                Note: Install expo-av for real microphone readings
              </Text>
            </Card>

            {/* Results Table */}
            <Card>
              <Title>📊 Results Table</Title>
              {actions.map((action, i) => (
                <View key={i} style={{ backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>{action.label}</Text>
                  <InputField label="Prediction (louder or softer than)" value={action.prediction} onChange={(v) => updateAction(i, "prediction", v)} placeholder="e.g. louder than action 1" />
                  <InputField label="Outcome (dB)" value={action.outcome} onChange={(v) => updateAction(i, "outcome", v)} placeholder="e.g. 72 dB" keyboardType="decimal-pad" />
                  <InputField label="Were you right?" value={action.correct} onChange={(v) => updateAction(i, "correct", v)} placeholder="Yes / No / Surprised" />
                </View>
              ))}
            </Card>
            <ActivitySubmitCard activityId="sound" activityName="Sound Pollution Hunter" />
          </View>
        )}

        {/* ── SCIENCE TAB ── */}
        {activeTab === 3 && (
          <View>
            <Card>
              <Title>Sound & Health</Title>
              <Body>Sound intensity varies depending on energy and surfaces. Prolonged loud noise can impact health and concentration. The decibel scale is logarithmic — 10 dB more means 10× the intensity.</Body>
            </Card>

            <Card>
              <Title>Sound Levels & Hearing Damage</Title>
              {DB_TABLE.map(({ range, example, risk, color }) => (
                <View key={range} style={{ flexDirection: "row", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
                  <Text style={{ fontSize: 12, color: "#3B82F6", width: 72, fontWeight: "600" }}>{range}</Text>
                  <Text style={{ fontSize: 12, color: "#6B7280", flex: 1 }}>{example}</Text>
                  <Text style={{ fontSize: 11, color, fontWeight: "600", width: 90, textAlign: "right" }}>{risk}</Text>
                </View>
              ))}
            </Card>

            <Card>
              <Title>Curriculum Links</Title>
              {["ACSSU073 – Sound and energy", "ACPPS053 – Health and wellbeing"].map((link) => (
                <BulletRow key={link} text={link} bullet="📌" />
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

// ── Helpers ──
function Card({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>{children}</View>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 10 }}>{children}</Text>;
}
function Body({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{children}</Text>;
}
function BulletRow({ text, bullet = "•" }: { text: string; bullet?: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
      <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 2 }}>{bullet}</Text>
      <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21, flex: 1 }}>{text}</Text>
    </View>
  );
}
function InputField({ label, value, onChange, placeholder, keyboardType = "default" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; keyboardType?: "default" | "decimal-pad" }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#D1D5DB" keyboardType={keyboardType}
        style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10, fontSize: 14, color: "#111827", backgroundColor: "#FAFAFA" }} />
    </View>
  );
}
