// app/activities/breathing.tsx


import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { startBreathingDetection } from "../../src/services/sensorService";
import ScreenContainer from "../../src/components/ScreenContainer";

const TAB_LABELS = ["Overview", "Instructions", "Sensor", "Results", "Science"];

type BreathRow = { phase: string; prediction: string; outcome: string; correct: string };

export default function BreathingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [phase, setPhase] = useState<"rest" | "exercise1" | "exercise2">("rest");

  // Sensor state
  const [isActive, setIsActive] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animated breathing circle
  const breathAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Animate the breathing circle based on BPM
  useEffect(() => {
    if (!isActive) return;
    const breathDuration = bpm > 0 ? (60 / bpm) * 1000 : 4000;
    const breathCycle = Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1.2, duration: breathDuration / 2, useNativeDriver: true }),
      Animated.timing(breathAnim, { toValue: 0.8, duration: breathDuration / 2, useNativeDriver: true }),
    ]);
    const loop = Animated.loop(breathCycle);
    loop.start();
    return () => loop.stop();
  }, [isActive, bpm]);

  const startSensor = () => {
  setIsActive(true);
  setElapsed(0);
  setBreathCount(0);
  setHistory([]);

  timerRef.current = setInterval(() => {
    setElapsed((e) => e + 1);
  }, 1000);

  const stopBreathing =
    startBreathingDetection((movementValue) => {

      const estimatedBreaths =
        Math.max(
          12,
          Math.min(
            40,
            Math.floor(movementValue * 18)
          )
        );

      setBpm(estimatedBreaths);

      setHistory((prev) => [
        ...prev.slice(-50),
        parseFloat(movementValue.toFixed(3)),
      ]);

      setBreathCount((prev) => prev + estimatedBreaths / 200);
    });

  intervalRef.current = stopBreathing as any;
};

 const stopSensor = () => {
  setIsActive(false);

  if (intervalRef.current) {
    (intervalRef.current as any)();
  }

  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  breathAnim.setValue(0.8);
};

  // Results
  const [rows, setRows] = useState<BreathRow[]>([
    { phase: "Breathing at Rest", prediction: "6 breaths/min", outcome: "", correct: "" },
    { phase: "After Exercise 1 (Jog 1 min)", prediction: "", outcome: "", correct: "" },
    { phase: "After Exercise 2 (100 star jumps)", prediction: "", outcome: "", correct: "" },
  ]);

  const updateRow = (i: number, field: keyof BreathRow, value: string) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: value };
    setRows(updated);
  };

  const getPhaseColor = () => {
    if (phase === "rest") return "#3B82F6";
    if (phase === "exercise1") return "#F59E0B";
    return "#EF4444";
  };

  const getPhaseLabel = () => {
    if (phase === "rest") return "At Rest";
    if (phase === "exercise1") return "After Jogging";
    return "After Star Jumps";
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
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>🫁 Breathing Pace Trainer</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Medical Science</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44 }}
        contentContainerStyle={{ paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
        {TAB_LABELS.map((tab, i) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(i)}
            style={{ marginRight: 20, paddingBottom: 10, borderBottomWidth: activeTab === i ? 2 : 0, borderBottomColor: "#3B82F6", height: 44, justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 14, fontWeight: activeTab === i ? "600" : "400", color: activeTab === i ? "#3B82F6" : "#9CA3AF" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* OVERVIEW */}
        {activeTab === 0 && (
          <View>
            <Card><Title>Overview</Title>
              <Body>Students analyse breathing patterns at rest and after exercise. Placing the phone on the chest allows the accelerometer to detect chest rise and fall, converting movement into a breathing rate (breaths per minute).</Body>
            </Card>
            <Card><Title>Equipment Needed</Title>
              {["Mobile phone with STEMM Lab app", "Flat surface or mat", "Comfortable clothing"].map((e) => <Bullet key={e} text={e} />)}
            </Card>
            <Card><Title>Write-Up Prompts</Title>
              {[
                "Predict your breathing rate at rest (breaths per minute).",
                "Predict your rate after each exercise.",
                "Were you right? Any surprises?",
                "How quickly did your breathing return to normal?",
              ].map((p) => <Bullet key={p} text={p} bullet="›" />)}
            </Card>
          </View>
        )}

        {/* INSTRUCTIONS */}
        {activeTab === 1 && (
          <View>
            <Card><Title>Exercises to Complete</Title>
              {[
                ["Rest", "Lie or sit still for 1 minute before measuring."],
                ["Exercise 1", "Jog on the spot for 1 minute, then measure immediately."],
                ["Exercise 2", "Complete 100 star jumps, then measure immediately."],
              ].map(([ex, desc]) => (
                <View key={ex as string} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D4ED8" }}>{ex}</Text>
                  <Text style={{ fontSize: 14, color: "#4B5563", marginTop: 2 }}>{desc}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Step-by-Step Instructions</Title>
            <Image
      source={require("../../assets/images/breathing.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
            
              {[
                "Lie down or sit still — rest for 1 minute.",
                "Place phone FACE UP, gently on your chest.",
                "Go to the Sensor tab, select 'At Rest'.",
                "Tap Start and breathe normally for 30 seconds.",
                "Note the BPM and record in Results.",
                "Do Exercise 1 (jog 1 minute on the spot).",
                "Immediately place phone on chest and measure again.",
                "Repeat for Exercise 2 (100 star jumps).",
                "Rotate through each team member.",
              ].map((step, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{step}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* SENSOR */}
        {activeTab === 2 && (
          <View>
            {/* Phase selector */}
            <Card>
              <Title>Select Measurement Phase</Title>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {(["rest", "exercise1", "exercise2"] as const).map((p) => (
                  <TouchableOpacity key={p} onPress={() => { if (!isActive) setPhase(p); }}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center",
                      backgroundColor: phase === p ? "#EFF6FF" : "#F9FAFB",
                      borderWidth: 1, borderColor: phase === p ? "#3B82F6" : "#E5E7EB" }}>
                    <Text style={{ fontSize: 11, fontWeight: phase === p ? "600" : "400", color: phase === p ? "#1D4ED8" : "#9CA3AF", textAlign: "center" }}>
                      {p === "rest" ? "🧘 Rest" : p === "exercise1" ? "🏃 Jog" : "⭐ Star Jumps"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* Live BPM display */}
            <Card>
              <Title>🫁 Breathing Rate Monitor</Title>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, textAlign: "center" }}>
                Phase: <Text style={{ fontWeight: "600", color: getPhaseColor() }}>{getPhaseLabel()}</Text>
              </Text>

              {/* Animated breathing circle */}
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Animated.View style={{
                  width: 130, height: 130, borderRadius: 65,
                  backgroundColor: getPhaseColor() + "22",
                  borderWidth: 4, borderColor: getPhaseColor(),
                  alignItems: "center", justifyContent: "center",
                  transform: [{ scale: breathAnim }],
                }}>
                  <Text style={{ fontSize: 38, fontWeight: "800", color: getPhaseColor() }}>
                    {bpm > 0 ? bpm : "--"}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#9CA3AF" }}>BPM</Text>
                </Animated.View>

                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 12 }}>
                  Duration: {elapsed}s | Estimated breaths: {Math.round(breathCount)}
                </Text>

                {/* Waveform */}
                <View style={{ flexDirection: "row", alignItems: "center", height: 40, width: "100%", marginTop: 12, gap: 1 }}>
                  {Array.from({ length: 50 }).map((_, idx) => {
                    const val = history[idx] ?? 0.4;
                    const height = Math.max(2, (val - 0.1) * 60);
                    return <View key={idx} style={{ flex: 1, backgroundColor: getPhaseColor(), borderRadius: 1, height }} />;
                  })}
                </View>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Chest movement waveform</Text>
              </View>

              {/* Normal range indicator */}
              {bpm > 0 && (
                <View style={{
                  borderRadius: 8, padding: 10, marginTop: 4,
                  backgroundColor: bpm < 12 ? "#FEF2F2" : bpm < 20 ? "#ECFDF5" : bpm < 30 ? "#FFFBEB" : "#FEF2F2",
                }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", textAlign: "center",
                    color: bpm < 12 ? "#EF4444" : bpm < 20 ? "#10B981" : bpm < 30 ? "#F59E0B" : "#EF4444" }}>
                    {bpm < 12 ? "Below normal – breathe deeper" :
                      bpm < 20 ? "✅ Normal range" :
                      bpm < 30 ? "Elevated – still normal after exercise" :
                      "High – take a rest"}
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                {!isActive ? (
                  <TouchableOpacity onPress={startSensor} style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>▶ Start Measuring</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={stopSensor} style={{ flex: 1, backgroundColor: "#EF4444", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>⏹ Stop</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
                Install expo-sensors for real chest-movement detection
              </Text>
            </Card>
          </View>
        )}

        {/* RESULTS */}
        {activeTab === 3 && (
          <View>
            <Card><Title>📊 Results Table</Title>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Record breathing rates for each phase.</Text>
              {rows.map((r, i) => (
                <View key={i} style={{ backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>{r.phase}</Text>
                  <InputField label="Predicted breaths per minute" value={r.prediction} onChange={(v) => updateRow(i, "prediction", v)} placeholder="e.g. 6 breaths/min" keyboardType="decimal-pad" />
                  <InputField label="Actual outcome" value={r.outcome} onChange={(v) => updateRow(i, "outcome", v)} placeholder="e.g. 14 BPM" keyboardType="decimal-pad" />
                  <InputField label="Were you right?" value={r.correct} onChange={(v) => updateRow(i, "correct", v)} placeholder="Yes / No" />
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* SCIENCE */}
        {activeTab === 4 && (
          <View>
            <Card><Title>Why Breathing Rate Changes</Title>
              <Body>Breathing rate increases during exercise to supply more oxygen to working muscles and remove CO₂. The brain detects rising CO₂ levels in the blood and signals the diaphragm and intercostal muscles to increase breathing rate and depth.</Body>
            </Card>
            <Card><Title>Normal Breathing Rates</Title>
              {[
                ["Adult at rest", "12–20 breaths/min"],
                ["Child at rest", "20–30 breaths/min"],
                ["During moderate exercise", "25–40 breaths/min"],
                ["During intense exercise", "40–60 breaths/min"],
                ["Recovery (1–2 min post-exercise)", "Returning toward rest"],
              ].map(([state, rate]) => (
                <View key={state as string} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 13, color: "#374151", flex: 1 }}>{state}</Text>
                  <Text style={{ fontSize: 13, color: "#3B82F6", fontWeight: "600" }}>{rate}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>How the Sensor Works</Title>
              <Body>The accelerometer measures the tiny tilt and movement of the phone as the chest rises and falls. Each breath cycle creates a regular oscillation in the Z-axis reading. The app counts peaks per minute to calculate BPM.</Body>
            </Card>
            <Card><Title>Curriculum Links</Title>
              {["ACSSU176 – Body systems", "ACPPS054 – Physical activity and health"].map((l) => <Bullet key={l} text={l} bullet="📌" />)}
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
