

import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Video, ResizeMode } from "expo-av";

export type VideoSlot = {
  id: string;
  label: string;          // e.g. "Prototype 1 – No parachute"
  hint?: string;          // e.g. "Use slow-motion if available"
  uri?: string;
};

export type ConductTabProps = {
  activityTitle: string;
  videoSlots: VideoSlot[];           // Define per activity how many/what videos needed
  sensorSummary?: Record<string, string>; // Auto-populated from sensor tab, e.g. {BPM: "18", Peak dB: "72"}
  onSubmit?: (data: SubmitPayload) => void | Promise<void>;
  onSlotsChange?: (slots: VideoSlot[]) => void;
  showSubmit?: boolean;
};

export type SubmitPayload = {
  videos: VideoSlot[];
  gps: { lat: number; lng: number; accuracy: number } | null;
  rating: number;
  reflection: string;
  sensorSummary: Record<string, string>;
  submittedAt: string;
};

// ── Star Rating ────────────────────────────────────────────────────
function StarRating({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onRate(n)}>
          <Text style={{ fontSize: 28, color: n <= rating ? "#F59E0B" : "#E5E7EB" }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Video Slot Card ────────────────────────────────────────────────
function VideoSlotCard({
  slot,
  onPick,
  onRemove,
}: {
  slot: VideoSlot;
  onPick: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const hasVideo = !!slot.uri;
  return (
    <View
      style={{
        backgroundColor: hasVideo ? "#ECFDF5" : "#F9FAFB",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: hasVideo ? "#10B981" : "#E5E7EB",
        borderStyle: hasVideo ? "solid" : "dashed",
        padding: 14,
        marginBottom: 10,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>{slot.label}</Text>
          {slot.hint && (
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{slot.hint}</Text>
          )}
        </View>
        {hasVideo && (
          <View style={{ backgroundColor: "#10B981", borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 }}>
            <Text style={{ fontSize: 11, color: "#fff", fontWeight: "600" }}>✓ Added</Text>
          </View>
        )}
      </View>

      {hasVideo ? (
        <>
          {/* Inline video preview */}
          <Video
            source={{ uri: slot.uri! }}
            style={{ width: "100%", height: 180, borderRadius: 8, marginTop: 10, backgroundColor: "#000" }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping={false}
          />
          {/* Action buttons */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => onPick(slot.id)}
              style={{ flex: 1, backgroundColor: "#EFF6FF", borderRadius: 8, paddingVertical: 9, alignItems: "center", borderWidth: 1, borderColor: "#BFDBFE" }}
            >
              <Text style={{ fontSize: 12, color: "#1D4ED8", fontWeight: "600" }}>🔄 Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onRemove(slot.id)}
              style={{ flex: 1, backgroundColor: "#FEE2E2", borderRadius: 8, paddingVertical: 9, alignItems: "center" }}
            >
              <Text style={{ fontSize: 12, color: "#EF4444", fontWeight: "600" }}>🗑 Remove</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => onPick(slot.id)}
            style={{ flex: 1, backgroundColor: "#3B82F6", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ fontSize: 13, color: "#fff", fontWeight: "600" }}>📹 Record Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPick(slot.id)}
            style={{ flex: 1, backgroundColor: "#EFF6FF", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#BFDBFE" }}
          >
            <Text style={{ fontSize: 13, color: "#1D4ED8", fontWeight: "600" }}>📂 Upload</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── GPS Banner ─────────────────────────────────────────────────────
function GpsBanner({
  gps,
  loading,
  onTag,
}: {
  gps: SubmitPayload["gps"];
  loading: boolean;
  onTag: () => void;
}) {
  if (gps) {
    return (
      <View style={{ backgroundColor: "#ECFDF5", borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 20 }}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#065F46" }}>Location Tagged</Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} · ±{Math.round(gps.accuracy)}m
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onTag}
      disabled={loading}
      style={{ backgroundColor: loading ? "#F9FAFB" : "#EFF6FF", borderRadius: 10, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#BFDBFE" }}
    >
      {loading ? <ActivityIndicator size="small" color="#3B82F6" /> : <Text style={{ fontSize: 20 }}>📍</Text>}
      <View>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#1D4ED8" }}>
          {loading ? "Getting location…" : "Tag GPS Location"}
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Records where the experiment was done</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Main ConductTab ────────────────────────────────────────────────
export default function ConductTab({
  activityTitle,
  videoSlots: initialSlots,
  sensorSummary = {},
  onSubmit,
  onSlotsChange,
  showSubmit = true,
}: ConductTabProps) {
  const [slots, setSlots] = useState<VideoSlot[]>(initialSlots);
  const [gps, setGps] = useState<SubmitPayload["gps"]>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickVideo = async (id: string) => {
  Alert.alert(
    "Add Video",
    "Choose an option",
    [
      {
        text: "📹 Record Now",
        onPress: async () => {
          const permission =
            await ImagePicker.requestCameraPermissionsAsync();

          if (!permission.granted) {
            Alert.alert(
              "Permission Needed",
              "Please allow camera access."
            );
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["videos"],
            allowsEditing: false,
            quality: 1,
            videoMaxDuration: 20,
          });

          if (!result.canceled) {
            updateSlot(id, result.assets[0].uri);
          }
        },
      },

      {
        text: "📂 Choose from Library",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permission.granted) {
            Alert.alert(
              "Permission Needed",
              "Please allow media library access."
            );
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            quality: 1,
          });

          if (!result.canceled) {
            updateSlot(id, result.assets[0].uri);
          }
        },
      },

      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  );
};

  const updateSlot = (id: string, uri: string) => {
    setSlots((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, uri } : s));
      onSlotsChange?.(next);
      return next;
    });
  };

  const removeSlot = (id: string) => {
    setSlots((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, uri: undefined } : s));
      onSlotsChange?.(next);
      return next;
    });
  };

  const tagGps = async () => {
    setGpsLoading(true);
    // Real implementation:
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") { setGpsLoading(false); return; }
    // const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    // setGps({ lat: loc.coords.latitude, lng: loc.coords.longitude, accuracy: loc.coords.accuracy ?? 0 });

    // Simulated (Melbourne area):
    await new Promise((r) => setTimeout(r, 1200));
    setGps({ lat: -37.8136 + Math.random() * 0.01, lng: 144.9631 + Math.random() * 0.01, accuracy: 8 + Math.random() * 12 });
    setGpsLoading(false);
  };

  const videosComplete = slots.filter((s) => s.uri).length;
  const canSubmit = rating > 0 && reflection.trim().length > 10;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Almost there!", "Please add a star rating and write a team reflection before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: SubmitPayload = {
        videos: slots.filter((s) => s.uri),
        gps,
        rating,
        reflection,
        sensorSummary,
        submittedAt: new Date().toISOString(),
      };
      await onSubmit?.(payload);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={{ backgroundColor: "#ECFDF5", borderRadius: 16, padding: 24, alignItems: "center", marginTop: 8 }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>🎉</Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#065F46", textAlign: "center" }}>
          Experiment Submitted!
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginTop: 8, lineHeight: 20 }}>
          Your results for {activityTitle} have been saved. Check the leaderboard to see how your team ranks!
        </Text>
        <View style={{ backgroundColor: "#D1FAE5", borderRadius: 10, padding: 12, marginTop: 16, width: "100%" }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#065F46", marginBottom: 6 }}>Submission Summary</Text>
          <SummaryRow label="Videos uploaded" value={`${videosComplete} / ${slots.length}`} />
          <SummaryRow label="GPS tagged" value={gps ? "Yes ✓" : "No"} />
          <SummaryRow label="Rating" value={"★".repeat(rating) + "☆".repeat(5 - rating)} />
          {Object.entries(sensorSummary).map(([k, v]) => (
            <SummaryRow key={k} label={k} value={v} />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setSubmitted(false)}
          style={{ marginTop: 14, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: "#3B82F6", borderRadius: 10 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Edit & Resubmit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {/* ── Video Section ── */}
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Title>📹 Videos</Title>
          <View style={{ backgroundColor: videosComplete === slots.length && slots.length > 0 ? "#D1FAE5" : "#F3F4F6", borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: videosComplete === slots.length && slots.length > 0 ? "#065F46" : "#9CA3AF" }}>
              {videosComplete} / {slots.length}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>
          Record or upload a video for each test. Use slow-motion when available.
        </Text>
        {slots.map((slot) => (
          <VideoSlotCard key={slot.id} slot={slot} onPick={pickVideo} onRemove={removeSlot} />
        ))}
      </Card>

      {/* ── GPS Section ── */}
      <Card>
        <Title>📍 Location Tag</Title>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 10 }}>
          Tag where your experiment was conducted.
        </Text>
        <GpsBanner gps={gps} loading={gpsLoading} onTag={tagGps} />
      </Card>

      {/* ── Sensor Data Summary ── */}
      {Object.keys(sensorSummary).length > 0 && (
        <Card>
          <Title>📊 Sensor Data (Auto-Saved)</Title>
          <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 10 }}>
            This data was recorded from your sensor session.
          </Text>
          {Object.entries(sensorSummary).map(([key, value]) => (
            <SummaryRow key={key} label={key} value={value} />
          ))}
        </Card>
      )}

      {showSubmit && (
        <>
          {/* ── Rating ── */}
          <Card>
            <Title>⭐ Rate This Activity</Title>
            <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 6 }}>
              How would you rate this experiment?
            </Text>
            <StarRating rating={rating} onRate={setRating} />
            {rating > 0 && (
              <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 8 }}>
                {["", "Not for me", "It was okay", "Pretty good!", "Really enjoyed it", "Absolutely loved it! 🏆"][rating]}
              </Text>
            )}
          </Card>

          {/* ── Team Reflection ── */}
          <Card>
            <Title>💬 Team Reflection</Title>
            <Text style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 10 }}>
              What did your team observe, learn, or find surprising?
            </Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="e.g. We were surprised that the bigger parachute wasn't always the slowest. We think the shape mattered more than the size…"
              placeholderTextColor="#D1D5DB"
              multiline
              numberOfLines={5}
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
                minHeight: 100,
              }}
            />
            <Text style={{ fontSize: 12, color: reflection.length > 10 ? "#10B981" : "#9CA3AF", marginTop: 5, textAlign: "right" }}>
              {reflection.length} characters {reflection.length < 10 ? `(need ${10 - reflection.length} more)` : "✓"}
            </Text>
          </Card>

          {/* ── Submit Button ── */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
            style={{
              backgroundColor: canSubmit ? "#3B82F6" : "#BFDBFE",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            {submitting ? (
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Uploading…</Text>
              </View>
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {canSubmit ? "🚀 Submit Experiment" : "Complete rating & reflection to submit"}
              </Text>
            )}
          </TouchableOpacity>

          {videosComplete < slots.length && (
            <Text style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginBottom: 16 }}>
              💡 Tip: You can submit without all videos, but try to include at least one!
            </Text>
          )}
        </>
      )}
    </View>
  );
}

// ── Shared helpers ──────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>
      {children}
    </View>
  );
}
function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 2 }}>{children}</Text>;
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
      <Text style={{ fontSize: 13, color: "#6B7280" }}>{label}</Text>
      <Text style={{ fontSize: 13, color: "#1F2937", fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
