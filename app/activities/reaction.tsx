// app/activities/reaction.tsx

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

const TAB_LABELS = ["Overview", "Phase 1", "Phase 2", "Phase 3", "Results", "Science"];

// ── Phase 1: Tap Reaction ──────────────────────────────────────────
function TapReactionGame() {
  const [status, setStatus] = useState<"idle" | "waiting" | "ready" | "tapped" | "early">("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [hand, setHand] = useState<"dominant" | "non-dominant">("dominant");
  const startRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = () => {
    setStatus("waiting");
    setReactionTime(null);
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => setStatus("ready"), delay);
  };

  const handleTap = () => {
    if (status === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("early");
      return;
    }
    if (status === "ready") {
      const rt = Date.now() - startRef.current;
      setReactionTime(rt);
      setScores((prev) => [...prev, rt]);
      setStatus("tapped");
      return;
    }
    if (status === "idle" || status === "tapped" || status === "early") {
      handleStart();
    }
  };

  useEffect(() => {
    if (status === "ready") startRef.current = Date.now();
  }, [status]);

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : null;

  const getBgColor = () => {
    if (status === "waiting") return "#1F2937";
    if (status === "ready") return "#10B981";
    if (status === "early") return "#EF4444";
    if (status === "tapped") return "#3B82F6";
    return "#F9FAFB";
  };

  const getLabel = () => {
    if (status === "idle") return "Tap to Begin";
    if (status === "waiting") return "Wait…";
    if (status === "ready") return "TAP NOW!";
    if (status === "early") return "Too Early! Tap to retry";
    if (status === "tapped") return reactionTime !== null ? `${reactionTime} ms\nTap to try again` : "Good!";
    return "";
  };

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        {(["dominant", "non-dominant"] as const).map((h) => (
          <TouchableOpacity key={h} onPress={() => setHand(h)}
            style={{ flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center",
              backgroundColor: hand === h ? "#EFF6FF" : "#F9FAFB",
              borderWidth: 1, borderColor: hand === h ? "#3B82F6" : "#E5E7EB" }}>
            <Text style={{ fontSize: 13, fontWeight: hand === h ? "600" : "400", color: hand === h ? "#1D4ED8" : "#9CA3AF" }}>
              {h === "dominant" ? "✋ Dominant" : "🤚 Non-dominant"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleTap}
        style={{ height: 180, backgroundColor: getBgColor(), borderRadius: 16, alignItems: "center", justifyContent: "center",
          borderWidth: status === "idle" ? 2 : 0, borderColor: "#E5E7EB" }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: status === "idle" ? "#9CA3AF" : "#FFFFFF", textAlign: "center", lineHeight: 30 }}>
          {getLabel()}
        </Text>
      </TouchableOpacity>

      {scores.length > 0 && (
        <View style={{ marginTop: 12, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#E5E7EB" }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            {hand === "dominant" ? "Dominant Hand" : "Non-dominant Hand"} – Scores
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {scores.map((s, i) => (
              <View key={i} style={{ backgroundColor: "#EFF6FF", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 13, color: "#1D4ED8" }}>#{i + 1}: {s} ms</Text>
              </View>
            ))}
          </View>
          {avg !== null && (
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 8 }}>Average: {avg} ms</Text>
          )}
        </View>
      )}
    </View>
  );
}

// ── Phase 3: Tracing Challenge ─────────────────────────────────────
function TracingChallenge() {
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [taps, setTaps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setIsActive(true);
    setScore(null);
    setTimeLeft(10);
    setTaps(0);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setIsActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isActive && taps > 0) setScore(taps);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  // Moving target positions (cycle through)
  const positions = [[30, 60], [200, 60], [115, 140], [30, 200], [200, 200]];
  const [targetIdx, setTargetIdx] = useState(0);

  const handleTargetTap = () => {
    if (!isActive) return;
    setTaps((t) => t + 1);
    setTargetIdx((i) => (i + 1) % positions.length);
  };

  return (
    <View>
      <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
        Tap the moving blue target as many times as possible in 10 seconds.
      </Text>
      <View style={{ height: 260, backgroundColor: "#F9FAFB", borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", overflow: "hidden", position: "relative" }}>
        {isActive && (
          <TouchableOpacity
            onPress={handleTargetTap}
            style={{ position: "absolute", left: positions[targetIdx][0], top: positions[targetIdx][1],
              width: 60, height: 60, borderRadius: 30, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>●</Text>
          </TouchableOpacity>
        )}
        {!isActive && score === null && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 16, color: "#9CA3AF" }}>Press Start to begin</Text>
          </View>
        )}
        {!isActive && score !== null && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 40, fontWeight: "800", color: "#1D4ED8" }}>{score}</Text>
            <Text style={{ fontSize: 16, color: "#6B7280" }}>targets hit in 10s</Text>
          </View>
        )}
        {isActive && (
          <View style={{ position: "absolute", top: 8, right: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#EF4444" }}>{timeLeft}s</Text>
            <Text style={{ fontSize: 13, color: "#374151", textAlign: "right" }}>Hits: {taps}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={start} disabled={isActive}
        style={{ backgroundColor: isActive ? "#D1D5DB" : "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>{isActive ? `${timeLeft}s remaining…` : score !== null ? "Try Again" : "Start Tracing Challenge"}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────
export default function ReactionScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  type AttemptRow = { attempt: string; prediction: string; outcome: string; correct: string };
  const [attempts, setAttempts] = useState<AttemptRow[]>([
    { attempt: "Attempt 1", prediction: "", outcome: "", correct: "" },
    { attempt: "Attempt 2", prediction: "", outcome: "", correct: "" },
    { attempt: "Attempt 3", prediction: "", outcome: "", correct: "" },
  ]);

  const updateAttempt = (i: number, field: keyof AttemptRow, value: string) => {
    const updated = [...attempts];
    updated[i] = { ...updated[i], [field]: value };
    setAttempts(updated);
  };

  const sensorSummary: Record<string, string> = {};
  attempts.forEach((a, i) => { if (a.outcome) sensorSummary[`Attempt ${i + 1} reaction time`] = a.outcome; });

  return (
    <ScreenContainer>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22, color: "#3B82F6" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>⚡ Reaction Board Challenge</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Neuroscience + Mathematics</Text>
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

        {activeTab === 0 && (
          <View>
            <Card><Title>Overview</Title>
            <Image
      source={require("../../assets/images/reaction.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
              <Body>Students measure reaction time and coordination through three progressive challenges: a simple tap test, a non-dominant hand test, and a moving target tracing challenge.</Body>
            </Card>
            <Card><Title>Three Phases</Title>
              {[
                ["Phase 1 – Tap Reaction", "Tap the screen when a signal appears"],
                ["Phase 2 – Swap Hands", "Repeat using your non-dominant hand"],
                ["Phase 3 – Tracing Challenge", "Tap a moving target as fast as possible"],
              ].map(([phase, desc]) => (
                <View key={phase as string} style={{ paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1D4ED8" }}>{phase}</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>{desc}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Phase 1: Dominant hand */}
        {activeTab === 1 && (
          <Card>
            <Title>Phase 1 – Tap Reaction (Dominant Hand)</Title>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              When the screen turns green, tap as fast as you can! Rotate through each team member.
            </Text>
            <TapReactionGame />
          </Card>
        )}

        {/* Phase 2: Non-dominant */}
        {activeTab === 2 && (
          <Card>
            <Title>Phase 2 – Swap Hands</Title>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              Repeat the tap test using your non-dominant hand. Compare results with Phase 1.
            </Text>
            <TapReactionGame />
          </Card>
        )}

        {/* Phase 3: Tracing */}
        {activeTab === 3 && (
          <Card>
            <Title>Phase 3 – Target Chase</Title>
            <TracingChallenge />
          </Card>
        )}

        {/* Results */}
        {activeTab === 4 && (
          <View>
            <Card><Title>📊 Results Table</Title>
              <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Record your reaction times and predictions.</Text>
              {attempts.map((a, i) => (
                <View key={i} style={{ backgroundColor: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" }}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 }}>{a.attempt}</Text>
                  <InputField label="Reaction time prediction" value={a.prediction} onChange={(v) => updateAttempt(i, "prediction", v)} placeholder="e.g. 250 ms" keyboardType="decimal-pad" />
                  <InputField label="Actual outcome" value={a.outcome} onChange={(v) => updateAttempt(i, "outcome", v)} placeholder="e.g. 320 ms delay" />
                  <InputField label="Were you right?" value={a.correct} onChange={(v) => updateAttempt(i, "correct", v)} placeholder="Yes / No" />
                </View>
              ))}
            </Card>
            <ActivitySubmitCard activityId="reaction" activityName="Reaction Board Challenge" sensorSummary={sensorSummary} />
          </View>
        )}

        {/* Science */}
        {activeTab === 5 && (
          <View>
            <Card><Title>How Reaction Time Works</Title>
              <Body>Reaction time measures how quickly the brain processes sensory information and sends motor signals to muscles. The pathway: eyes → visual cortex → motor cortex → muscles. Practice and focus reduce this delay. Dominant hands are generally faster due to stronger neural pathways.</Body>
            </Card>
            <Card><Title>Typical Reaction Times</Title>
              {[["Simple visual", "150–300 ms"], ["Complex decision", "300–500 ms"], ["Non-dominant hand", "+20–50 ms slower"], ["After practice", "Improves 10–20%"]].map(([type, time]) => (
                <View key={type as string} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
                  <Text style={{ fontSize: 13, color: "#374151" }}>{type}</Text>
                  <Text style={{ fontSize: 13, color: "#3B82F6", fontWeight: "600" }}>{time}</Text>
                </View>
              ))}
            </Card>
            <Card><Title>Curriculum Links</Title>
              {["ACSIS130 – Collecting and analysing data", "ACMSP147 – Averages and variation", "ACPPS057 – Understanding physical performance"].map((l) => (
                <Bullet key={l} text={l} bullet="📌" />
              ))}
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
