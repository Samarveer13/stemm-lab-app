import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>
      {children}
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 10 }}>{children}</Text>;
}
export { Title as CTitle };

export function Body({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{children}</Text>;
}

export function Bullet({ text, bullet = "•" }: { text: string; bullet?: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
      <Text style={{ fontSize: 14, color: "#9CA3AF" }}>{bullet}</Text>
      <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21, flex: 1 }}>{text}</Text>
    </View>
  );
}
export { Bullet as BulletRow };

export function StepBadge({ n }: { n: number }) {
  return (
    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{n}</Text>
    </View>
  );
}

export function InputField({ label, value, onChange, placeholder, keyboardType = "default" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad";
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#D1D5DB"
        keyboardType={keyboardType}
        style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10, fontSize: 14, color: "#111827", backgroundColor: "#FAFAFA" }}
      />
    </View>
  );
}

export function IField({ label, value, onChange, ph, kbt = "default" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ph?: string;
  kbt?: "default" | "decimal-pad";
}) {
  return <InputField label={label} value={value} onChange={onChange} placeholder={ph} keyboardType={kbt} />;
}

export function Header({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) {
  return (
    <View>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 4, padding: 12 }}>
          <Text style={{ fontSize: 24, color: "#3B82F6" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>{title}</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function TabBar({ tabs, active, onPress }: { tabs: string[]; active: number; onPress: (i: number) => void }) {
  return (
    <View style={{ position: "sticky" as any, top: 0, zIndex: 50, backgroundColor: "#F9FAFB" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44 }}
        contentContainerStyle={{ paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}
      >
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onPress(i)}
            style={{ marginRight: 20, paddingBottom: 10, borderBottomWidth: active === i ? 2 : 0, borderBottomColor: "#3B82F6", height: 44, justifyContent: "flex-end" }}
          >
            <Text style={{ fontSize: 14, fontWeight: active === i ? "600" : "400", color: active === i ? "#3B82F6" : "#9CA3AF" }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
