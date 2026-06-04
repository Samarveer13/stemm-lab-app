// app/activities/performance.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { Card, Title, Body, Bullet, InputField } from "../../src/components/ActivityShared";

// Install: npx expo install expo-sensors
// import { Accelerometer } from "expo-sensors";

const TAB_LABELS = ["Overview", "Instructions", "Sensor", "Results", "Science"];

const MOVEMENTS = [
  { id: 1, name: "Movement 1", desc: "Slow arm raise to shoulder height" },
  { id: 2, name: "Movement 2", desc: "Side-to-side arm swing" },
  { id: 3, name: "Movement 3", desc: "Full overhead reach and lower" },
];

type AttemptRow = {
  movement: string;
  prediction: string;
  outcome: string;
  correct: string;
};

export default function PerformanceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMovement, setSelectedMovement] = useState(0);

  // Sensor state
  const [isActive, setIsActive] = useState(false);
  const [smoothness, setSmoothness] = useState(100);
  const [vibMag, setVibMag] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [attempts, setAttempts] = useState<AttemptRow[]>([
    { movement: "Attempt 1", prediction: "±1 cm", outcome: "", correct: "" },
    { movement: "Attempt 2", prediction: "", outcome: "", correct: "" },
    { movement: "Attempt 3", prediction: "", outcome: "", correct: "" },
  ]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSensor = () => {
    setIsActive(true);
    setElapsed(0);
    setHistory([]);
    setSmoothness(100);

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    intervalRef.current = setInterval(() => {
      // Simulated — replace with Accelerometer.addListener
      const jerk = parseFloat((Math.random() * 0.4).toFixed(3));
      setVibMag(jerk);
      setSmoothness((prev) => Math.max(0, prev - jerk * 8));
      setHistory((prev) => [...prev.slice(-40), jerk]);
    }, 200);
  };

  const stopSensor = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const getSmoothnessLabel = (s: number) => {
    if (s > 75) return { label: "Excellent", color: "#10B981" };
    if (s > 50) return { label: "Good", color: "#F59E0B" };
    if (s > 25) return { label: "Needs Practice", color: "#F97316" };
    return { label: "Jerky", color: "#EF4444" };
  };

  const { label: smLabel, color: smColor } = getSmoothnessLabel(smoothness);

  const sensorSummary: Record<string, string> = {};
  if (smoothness < 100) sensorSummary["Movement smoothness"] = `${Math.round(smoothness)}/100 (${smLabel})`;
  attempts.forEach((a, i) => { if (a.outcome) sensorSummary[`Attempt ${i + 1} outcome`] = a.outcome; });

  const draftReadyRef = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem('@stemm_form_performance').then((raw) => {
      if (raw) {
        try {
          const d = JSON.parse(raw);
          if (d.attempts) setAttempts(d.attempts);
        } catch {}
      }
      draftReadyRef.current = true;
    });
  }, []);
  useEffect(() => {
    if (!draftReadyRef.current) return;
    AsyncStorage.setItem('@stemm_form_performance', JSON.stringify({ attempts })).catch(() => {});
  }, [attempts]);

  const updateAttempt = (i: number, field: keyof AttemptRow, value: string) => {
    const updated = [...attempts];
    updated[i] = { ...updated[i], [field]: value };
    setAttempts(updated);
  };

  return (
    <ScreenContainer>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 4, padding: 12 }}>
          <Text style={{ fontSize: 22, color: "#3B82F6" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>🏃 Human Performance Lab</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Medical Science + Biomechanics</Text>
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

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* OVERVIEW */}
        {activeTab === 0 && (
          <View>
            <Card><Title>Overview</Title>
              <Body>Students investigate how the human body moves by measuring speed, smoothness, and coordination during controlled stretching. The phone's vibration sensor detects jerky vs smooth movement.</Body>
            </Card>
            <Card><Title>Equipment Needed</Title>
              {["Mobile phone with STEMM Lab app", "Open space to move safely"].map((e) => <Bullet key={e} text={e} />)}
            </Card>
            <Card><Title>Write-Up Prompts</Title>
              {["Which movement was the hardest to keep the vibration low?", "Record results for each attempt.", "Were you right? Any surprises?"].map((p) => <Bullet key={p} text={p} bullet="›" />)}
            </Card>
          </View>
        )}

        {/* INSTRUCTIONS */}
        {activeTab === 1 && (
          <View>
            <Card><Title>Three Movements to Test</Title>
              {MOVEMENTS.map((m) => (
                <View key={m.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D4ED8" }}>{m.name}</Text>
                  <Text style={{ fontSize: 14, color: "#4B5563", marginTop: 2 }}>{m.desc}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Step-by-Step Instructions</Title>
            <Image
      source={require("../../assets/images/performance.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
              {[
                "Hold the phone firmly in one hand.",
                "Go to the Sensor tab and select your movement.",
                "Tap Start and perform the movement slowly.",
                "Review the smoothness score.",
                "Repeat with vibration feedback enabled.",
                "Try faster then slower — compare scores.",
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
            {/* Movement Selector */}
            <Card>
              <Title>Select Movement</Title>
              {MOVEMENTS.map((m, i) => (
                <TouchableOpacity key={m.id} onPress={() => setSelectedMovement(i)}
                  style={{ flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 8, marginBottom: 6,
                    backgroundColor: selectedMovement === i ? "#EFF6FF" : "#F9FAFB",
                    borderWidth: 1, borderColor: selectedMovement === i ? "#3B82F6" : "#E5E7EB" }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                    borderColor: selectedMovement === i ? "#3B82F6" : "#D1D5DB",
                    backgroundColor: selectedMovement === i ? "#3B82F6" : "transparent", marginRight: 10 }} />
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: selectedMovement === i ? "#1D4ED8" : "#374151" }}>{m.name}</Text>
                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{m.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Card>

            {/* Live Sensor Display */}
            <Card>
              <Title>📳 Smoothness Monitor</Title>
              <View style={{ alignItems: "center", paddingVertical: 12 }}>
                {/* Circular smoothness gauge */}
                <View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: smColor,
                  alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <Text style={{ fontSize: 32, fontWeight: "800", color: smColor }}>{Math.round(smoothness)}</Text>
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>/ 100</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: smColor }}>{smLabel}</Text>
                <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Time: {elapsed}s | Jerk: {vibMag.toFixed(3)}</Text>

                {/* Waveform */}
                <View style={{ flexDirection: "row", alignItems: "flex-end", height: 40, width: "100%", marginTop: 12, gap: 1 }}>
                  {Array.from({ length: 40 }).map((_, idx) => {
                    const val = history[idx] ?? 0;
                    return <View key={idx} style={{ flex: 1, backgroundColor: val > 0.2 ? "#EF4444" : "#3B82F6", borderRadius: 2, height: Math.max(2, val * 80) }} />;
                  })}
                </View>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Jerk waveform (lower = smoother)</Text>
              </View>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                {!isActive ? (
                  <TouchableOpacity onPress={startSensor} style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>▶ Start</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={stopSensor} style={{ flex: 1, backgroundColor: "#EF4444", borderRadius: 10, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>⏹ Stop</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </View>
        )}

        {/* RESULTS */}
        {activeTab === 3 && (
          <View>
            <Card><Title>📊 Results Table</Title>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Record phone vibration and time for each attempt.</Text>
              {attempts.map((a, i) => (
                <View key={i} style={{ backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>{a.movement}</Text>
                  <InputField label="Predicted vibration (absolute)" value={a.prediction} onChange={(v) => updateAttempt(i, "prediction", v)} placeholder="e.g. ±1 cm" />
                  <InputField label="Outcome (time + movement)" value={a.outcome} onChange={(v) => updateAttempt(i, "outcome", v)} placeholder="e.g. 5 mm in 20 seconds" />
                  <InputField label="Were you right?" value={a.correct} onChange={(v) => updateAttempt(i, "correct", v)} placeholder="Yes / No" />
                </View>
              ))}
            </Card>
            <ActivitySubmitCard activityId="performance" activityName="Human Performance Lab" sensorSummary={sensorSummary} />
          </View>
        )}

        {/* SCIENCE */}
        {activeTab === 4 && (
          <View>
            <Card><Title>Biomechanics & Movement</Title>
              <Body>Muscles and joints work together to create movement. Faster movements often reduce control, while smoother movements show better neuromuscular coordination. Sensors in the phone measure acceleration changes — sudden changes (jerk) indicate poor control.</Body>
            </Card>
            <Card><Title>Key Concepts</Title>
              {[
                ["Smoothness", "Minimal jerk; consistent velocity throughout movement"],
                ["Fatigue", "Muscles tire, causing increasing jerkiness over time"],
                ["Dominant hand", "Usually smoother due to more neural connections"],
                ["Practice effect", "Repeated trials often improve scores"],
              ].map(([term, def]) => (
                <View key={term as string} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#1D4ED8" }}>{term}</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{def}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Curriculum Links</Title>
              {["ACPPS051 – Movement skills", "ACPPS054 – Physical performance", "ACSSU176 – Structure and function of body systems"].map((l) => <Bullet key={l} text={l} bullet="📌" />)}
            </Card>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

