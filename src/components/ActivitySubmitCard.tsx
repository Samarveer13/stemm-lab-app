import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useActivitySubmit } from "../hooks/useActivitySubmit";

interface Props {
  activityId: string;
  activityName: string;
}

export default function ActivitySubmitCard({ activityId, activityName }: Props) {
  const submit = useActivitySubmit(activityId, activityName);
  const [rating, setRating] = useState(0);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = rating > 0 && reflection.trim().length > 10;

  if (submitted) {
    return (
      <View style={{ backgroundColor: "#ECFDF5", borderRadius: 14, borderWidth: 1, borderColor: "#10B981", padding: 20, alignItems: "center", marginBottom: 14 }}>
        <Text style={{ fontSize: 36, marginBottom: 8 }}>🎉</Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#065F46", textAlign: "center" }}>
          Results Submitted!
        </Text>
        <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 6, lineHeight: 18 }}>
          Your {activityName} results have been saved to your team's score.
        </Text>
        <TouchableOpacity
          onPress={() => { setSubmitted(false); setRating(0); setReflection(""); }}
          style={{ marginTop: 14, paddingVertical: 8, paddingHorizontal: 20, backgroundColor: "#3B82F6", borderRadius: 10 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Resubmit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>
      <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 12 }}>
        🚀 Submit Results
      </Text>

      {/* Star Rating */}
      <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>Rate this activity</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setRating(n)}>
            <Text style={{ fontSize: 28, color: n <= rating ? "#F59E0B" : "#E5E7EB" }}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reflection */}
      <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>Team reflection</Text>
      <TextInput
        value={reflection}
        onChangeText={setReflection}
        placeholder="What did your team observe or find surprising?"
        placeholderTextColor="#D1D5DB"
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1.5,
          borderColor: reflection.length > 10 ? "#10B981" : "#E5E7EB",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
          fontSize: 14,
          color: "#111827",
          backgroundColor: "#FAFAFA",
          textAlignVertical: "top",
          minHeight: 90,
          marginBottom: 4,
        }}
      />
      <Text style={{ fontSize: 12, color: reflection.length > 10 ? "#10B981" : "#9CA3AF", textAlign: "right", marginBottom: 14 }}>
        {reflection.length} chars {reflection.length < 10 ? `(need ${10 - reflection.length} more)` : "✓"}
      </Text>

      <TouchableOpacity
        onPress={async () => {
          if (!canSubmit) return;
          setSubmitting(true);
          try {
            await submit({
              videos: [],
              gps: null,
              rating,
              reflection,
              sensorSummary: {},
              submittedAt: new Date().toISOString(),
            });
            setSubmitted(true);
          } finally {
            setSubmitting(false);
          }
        }}
        disabled={!canSubmit || submitting}
        style={{
          backgroundColor: canSubmit ? "#3B82F6" : "#BFDBFE",
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
        }}
      >
        {submitting ? (
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Saving…</Text>
          </View>
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            {canSubmit ? "Submit to Leaderboard" : "Add rating & reflection to submit"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
