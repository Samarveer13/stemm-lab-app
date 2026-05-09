// app/activities/earthquake.tsx

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import ActivitySubmitCard from "../../src/components/ActivitySubmitCard";

// Install: npx expo install expo-sensors
import { Accelerometer, Gyroscope } from "expo-sensors";

const TAB_LABELS = ["Overview", "Instructions", "Sensor", "Results", "Science"];

type DesignRow = {
  label: string;
  prediction: string;
  outcome: string;
  correct: string;
};

export default function EarthquakeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // Accelerometer simulation state
  // Replace with real Accelerometer subscription when expo-sensors is installed
  const [isActive, setIsActive] = useState(false);
  const [vibrationMag, setVibrationMag] = useState(0);
  const [peakVibration, setPeakVibration] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const intervalRef = useRef<any>(null);

  // Results
  const [designs, setDesigns] = useState<DesignRow[]>([
    { label: "Design 1 – 4 folds + 4 pillars", prediction: "±1 cm", outcome: "", correct: "" },
    { label: "Design 2 – 10 folds + 4 pillars", prediction: "", outcome: "", correct: "" },
    { label: "Design 3 – 3 folds + 6 pillars", prediction: "", outcome: "", correct: "" },
  ]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startSensor = () => {
  setIsActive(true);
  setPeakVibration(0);
  setHistory([]);

  Accelerometer.setUpdateInterval(200);
  Gyroscope.setUpdateInterval(200);

  const accelSub = Accelerometer.addListener(({ x, y, z }) => {
    const mag = Math.sqrt(x * x + y * y + z * z);
    const movement = Math.abs(mag - 1.0);

    setVibrationMag(movement);
    setPeakVibration((prev) => Math.max(prev, movement));
    setHistory((prev) => [...prev.slice(-30), movement]);
  });

  const gyroSub = Gyroscope.addListener(({ x, y, z }) => {
    setGyro({ x, y, z });
  });

  intervalRef.current = {
    accelSub,
    gyroSub,
  } as any;
};

  const stopSensor = () => {
  setIsActive(false);

  if (intervalRef.current) {
    (intervalRef.current as any).accelSub?.remove();
    (intervalRef.current as any).gyroSub?.remove();
  }
};

  const getMagColor = (v: number) => {
    if (v < 0.1) return "#10B981";
    if (v < 0.3) return "#F59E0B";
    if (v < 0.5) return "#F97316";
    return "#EF4444";
  };

  const updateDesign = (i: number, field: keyof DesignRow, value: string) => {
    const updated = [...designs];
    updated[i] = { ...updated[i], [field]: value };
    setDesigns(updated);
  };

  return (
    <ScreenContainer>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: "#3B82F6" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>🏗 Earthquake-Resistant Structure</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Engineering + Earth Science</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44 }} contentContainerStyle={{ paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
        {TAB_LABELS.map((tab, i) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(i)}
            style={{ marginRight: 20, paddingBottom: 10, borderBottomWidth: activeTab === i ? 2 : 0, borderBottomColor: "#3B82F6", height: 44, justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 14, fontWeight: activeTab === i ? "600" : "400", color: activeTab === i ? "#3B82F6" : "#9CA3AF" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* OVERVIEW */}
        {activeTab === 0 && (
          <View>
            <Card><Title>Overview</Title>
              <Body>Students design structures that withstand vibration, simulating earthquakes. The phone's accelerometer measures movement to compare how well each design absorbs vibration.</Body>
            </Card>
            <Card><Title>Equipment Needed</Title>
              {["Cardboard", "Paper", "Scissors", "Sticky tape", "Plastic or paper cups", "Mobile phone with accelerometer"].map((e) => <Bullet key={e} text={e} />)}
            </Card>
            <Card><Title>Write-Up Prompts</Title>
              {[
                "Predict which fold design makes the phone move the least.",
                "Record the phone movement in centimetres.",
                "Were you right? Any surprises?",
              ].map((p) => <Bullet key={p} text={p} bullet="›" />)}
            </Card>
          </View>
        )}

        {/* INSTRUCTIONS */}
        {activeTab === 1 && (
          <View>
            <Card><Title>Step-by-Step Instructions</Title>
            <Image
      source={require("../../assets/images/earthquake.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
              {[
                "Build an anti-vibration layer by folding paper or cardboard.",
                "Place a flat cardboard platform on top of your structure.",
                "Place the phone in the CENTRE of the platform.",
                "Go to the Sensor tab and tap Start.",
                "Gently shake the table to simulate an earthquake.",
                "Note the vibration reading and peak value.",
                "Modify the structure (more pillars, more folds) and repeat.",
              ].map((step, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{step}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Modification Ideas</Title>
              {["Add more folds to absorb energy", "Add more pillars for stability", "Use a wider base", "Try different materials (foam, bubble wrap)"].map((t) => <Bullet key={t} text={t} />)}
            </Card>
          </View>
        )}

        {/* SENSOR */}
        {activeTab === 2 && (
          <View>
            <Card>
              <Title>📳 Vibration Sensor</Title>
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Text style={{ fontSize: 56, fontWeight: "800", color: getMagColor(vibrationMag) }}>
                  {vibrationMag.toFixed(3)}
                </Text>
                <Text style={{ fontSize: 16, color: "#9CA3AF" }}>m/s² (movement)</Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Peak: {peakVibration.toFixed(3)} m/s²</Text>

                {/* Mini waveform */}
                <View style={{ flexDirection: "row", alignItems: "flex-end", height: 48, width: "100%", marginTop: 16, gap: 2 }}>
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const val = history[idx] ?? 0;
                    return (
                      <View key={idx} style={{ flex: 1, backgroundColor: getMagColor(val), borderRadius: 2, height: Math.max(4, val * 80) }} />
                    );
                  })}
                </View>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Live vibration waveform</Text>
              </View>
              <View
  style={{
    marginTop: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  }}
>
  <Text style={{ fontWeight: "600", marginBottom: 6 }}>
    Gyroscope Rotation
  </Text>

  <Text>X Rotation: {gyro.x.toFixed(3)}</Text>
  <Text>Y Rotation: {gyro.y.toFixed(3)}</Text>
  <Text>Z Rotation: {gyro.z.toFixed(3)}</Text>
</View>

              {/* Vibration rating */}
              <View style={{
                backgroundColor: vibrationMag < 0.1 ? "#ECFDF5" : vibrationMag < 0.3 ? "#FFFBEB" : "#FEF2F2",
                borderRadius: 8, padding: 10, marginTop: 4
              }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: getMagColor(vibrationMag), textAlign: "center" }}>
                  {vibrationMag < 0.1 ? "✅ Very stable – excellent design!" :
                    vibrationMag < 0.3 ? "⚠️ Moderate vibration – try modifications" :
                    "❌ High vibration – redesign needed"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                {!isActive ? (
                  <TouchableOpacity onPress={startSensor} style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>▶ Start Sensor</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={stopSensor} style={{ flex: 1, backgroundColor: "#EF4444", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>⏹ Stop Sensor</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
                Install expo-sensors for real accelerometer data
              </Text>
            </Card>
          </View>
        )}

        {/* RESULTS */}
        {activeTab === 3 && (
          <View>
            <Card><Title>📊 Results Table</Title>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Record phone movement for each design.</Text>
              {designs.map((d, i) => (
                <View key={i} style={{ backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>{d.label}</Text>
                  <InputField label="Predicted phone movement" value={d.prediction} onChange={(v) => updateDesign(i, "prediction", v)} placeholder="e.g. ±1 cm" />
                  <InputField label="Observed movement (cm or peak dB)" value={d.outcome} onChange={(v) => updateDesign(i, "outcome", v)} placeholder="e.g. 3 cm" keyboardType="decimal-pad" />
                  <InputField label="Were you right?" value={d.correct} onChange={(v) => updateDesign(i, "correct", v)} placeholder="Yes / No" />
                </View>
              ))}
            </Card>
            <ActivitySubmitCard activityId="earthquake" activityName="Earthquake-Resistant Structure" />
          </View>
        )}

        {/* SCIENCE */}
        {activeTab === 4 && (
          <View>
            <Card><Title>How Buildings Resist Earthquakes</Title>
              <Body>Earthquakes cause ground vibrations that can collapse poorly designed structures. Engineers design buildings with base isolators, dampers, and cross-bracing to absorb and distribute seismic energy safely. The goal is to reduce acceleration at the top of the structure.</Body>
            </Card>
            <Card><Title>Key Engineering Principles</Title>
              {[
                ["Base isolation", "Flexible foundation absorbs ground movement"],
                ["Cross-bracing", "Diagonal supports distribute lateral forces"],
                ["Dampers", "Energy-absorbing devices reduce oscillation"],
                ["Wide base", "Lower centre of gravity improves stability"],
              ].map(([term, def]) => (
                <View key={term as string} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#1D4ED8" }}>{term}</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{def}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Curriculum Links</Title>
              {["ACSSU096 – Earth processes and natural disasters", "ACTDEP036 – Testing and improving designs"].map((l) => <Bullet key={l} text={l} bullet="📌" />)}
            </Card>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>{children}</View>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 10 }}>{children}</Text>;
}
function Body({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{children}</Text>;
}
function Bullet({ text, bullet = "•" }: { text: string; bullet?: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
      <Text style={{ fontSize: 14, color: "#9CA3AF" }}>{bullet}</Text>
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
