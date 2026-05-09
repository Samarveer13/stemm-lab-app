// app/activities/parachute.tsx



import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ConductTab from "../../src/components/Conducttab";
import ScreenContainer from "../../src/components/ScreenContainer";
import ActivitySubmitCard from "../../src/components/ActivitySubmitCard";
import { requestCameraAccess } from "../../src/services/cameraService";


type TrialRow = { label: string; prediction: string; time: string; correct: string; stopTime: string };
const TAB_LABELS = ["Overview", "Instructions", "Conduct", "Results", "Science"];

export default function ParachuteScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [trials, setTrials] = useState<TrialRow[]>([
    { label: "Action 1 – No parachute (baseline)", prediction: "", time: "", correct: "", stopTime: "" },
    { label: "Action 2 – Plastic, 4 corners tied", prediction: "", time: "", correct: "", stopTime: "" },
    { label: "Action 3 – Custom design", prediction: "", time: "", correct: "", stopTime: "" },
  ]);
  const [dropHeight, setDropHeight] = useState(""); const [fallTime, setFallTime] = useState(""); const [mass, setMass] = useState(""); const [contactTime, setContactTime] = useState("");
  const [calc, setCalc] = useState<{ vFinal: number; accel: number; netForce: number; weight: number; drag: number; gForce: number | null } | null>(null);
  const [cameraStatus, setCameraStatus] = useState("Camera not checked");

  const updateTrial = (i: number, f: keyof TrialRow, v: string) => { const u = [...trials]; u[i] = { ...u[i], [f]: v }; setTrials(u); };

  const doCalc = () => {
    const h = parseFloat(dropHeight), t = parseFloat(fallTime), m = parseFloat(mass), tc = parseFloat(contactTime);
    if (!h || !t || !m) { Alert.alert("Missing Input", "Enter height, time and mass."); return; }
    const vFinal = h / t, accel = vFinal / t, netForce = m * accel, weight = m * 9.8, drag = weight - netForce;
    setCalc({ vFinal, accel, netForce, weight, drag, gForce: tc ? (vFinal / tc) / 9.8 : null });
  };

  const checkCamera = async () => {
  const allowed = await requestCameraAccess();

  if (allowed) {
    setCameraStatus("✅ Camera ready for recording");
  } else {
    setCameraStatus("❌ Camera permission denied");
  }
};

  const sensorSummary: Record<string, string> = {};
  trials.forEach((t, i) => { if (t.time) sensorSummary[`Action ${i + 1} fall time`] = `${t.time}s`; });
  if (calc) { sensorSummary["Final velocity"] = `${calc.vFinal.toFixed(2)} m/s`; sensorSummary["Drag force"] = `${calc.drag.toFixed(3)} N`; if (calc.gForce !== null) sensorSummary["G-Force"] = `${calc.gForce.toFixed(1)} g`; }

  return (
    <ScreenContainer>
      <Header onBack={() => router.back()} title="🪂 Parachute Drop Challenge" subtitle="Engineering + Physics" />
      <TabBar tabs={TAB_LABELS} active={activeTab} onPress={setActiveTab} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {activeTab === 0 && <View>
          <Card><CTitle>Overview</CTitle><Body>Students design, build, and test a parachute for a small toy to reduce landing speed. Teams iterate designs under time and material constraints.</Body></Card>
          <Card><CTitle>Equipment Needed</CTitle>{["Mobile phone with STEMM Lab app","Small toy (e.g. army soldier)","Table or elevated surface","Paper or plastic sheet","String","Scissors","Tape"].map(e=><Bullet key={e} text={e}/>)}</Card>
          <Card><CTitle>Write-Up Prompts</CTitle>{["Predict which parachute design was best.","Sketch each design on paper.","Record the time for each design.","Were you correct? What was easiest to make?"].map(p=><Bullet key={p} text={p} bullet="›"/>)}</Card>
        </View>}

        {activeTab === 1 && <View>
          <Card><CTitle>Step-by-Step Instructions</CTitle>
         <Image
      source={require("../../assets/images/parachute.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
            {["Drop toy WITHOUT parachute – record the fall (baseline).","Build a parachute with provided materials.","Drop from the SAME height – record fall.","Review speed results.","Redesign and test up to 3 prototypes within 20 min.","Upload videos in the Conduct tab."].map((s,i)=>(
              <View key={i} style={{flexDirection:"row",gap:8,marginBottom:10,alignItems:"flex-start"}}><StepBadge n={i+1}/><Text style={{flex:1,fontSize:14,color:"#4B5563",lineHeight:21}}>{s}</Text></View>
            ))}</Card>
          <Card><CTitle>📹 Video Tips</CTitle>{["Slow-motion video preferred for impact analysis.","Place ruler in frame for scale.","Record each prototype separately."].map(t=><Bullet key={t} text={t}/>)}</Card>
        </View>}
        
        {activeTab === 2 && (
          <View>
            <Card>
              <CTitle>📷 Camera Access</CTitle>
              <TouchableOpacity
                onPress={checkCamera}
                style={{ backgroundColor: "#3B82F6", borderRadius: 10, paddingVertical: 12, alignItems: "center", marginBottom: 10 }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Enable Camera</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 13, color: "#6B7280" }}>{cameraStatus}</Text>
            </Card>
            <ConductTab
              activityTitle="Parachute Drop Challenge"
              videoSlots={[
                { id: "baseline", label: "Drop 1 – No parachute (baseline)", hint: "Drop from same height. Slow-motion preferred." },
                { id: "proto2",   label: "Drop 2 – First parachute design",  hint: "Capture full fall in frame." },
                { id: "proto3",   label: "Drop 3 – Improved design",         hint: "Use ruler in frame for scale." },
              ]}
              sensorSummary={sensorSummary}
              onSubmit={(data) => console.log("Parachute submitted:", data)}
            />
          </View>
        )}

        {activeTab === 3 && <View>
          <Card><CTitle>📊 Results Table</CTitle>
            {trials.map((trial, i) => (
              <View key={i} style={{backgroundColor:"#F9FAFB",borderRadius:10,padding:12,marginBottom:12,borderWidth:1,borderColor:"#E5E7EB"}}>
                <Text style={{fontSize:13,fontWeight:"600",color:"#374151",marginBottom:8}}>{trial.label}</Text>
                <IField label="Prediction (seconds to ground?)" value={trial.prediction} onChange={v=>updateTrial(i,"prediction",v)} ph="e.g. 0.5 seconds"/>
                <IField label="Actual fall time (s)" value={trial.time} onChange={v=>updateTrial(i,"time",v)} ph="e.g. 0.48" kbt="decimal-pad"/>
                <IField label="Were you right?" value={trial.correct} onChange={v=>updateTrial(i,"correct",v)} ph="Yes / No / Close"/>
                <IField label="Time to stop moving – slow-mo (s)" value={trial.stopTime} onChange={v=>updateTrial(i,"stopTime",v)} ph="e.g. 0.05" kbt="decimal-pad"/>
              </View>
            ))}
          </Card>
          <Card><CTitle>🔢 Physics Calculator</CTitle>
            <IField label="Drop Height (m)" value={dropHeight} onChange={setDropHeight} ph="e.g. 1.0" kbt="decimal-pad"/>
            <IField label="Fall Time (s)" value={fallTime} onChange={setFallTime} ph="e.g. 0.5" kbt="decimal-pad"/>
            <IField label="Mass (kg)" value={mass} onChange={setMass} ph="e.g. 0.02" kbt="decimal-pad"/>
            <IField label="Contact time (s) – optional" value={contactTime} onChange={setContactTime} ph="e.g. 0.05" kbt="decimal-pad"/>
            <TouchableOpacity onPress={doCalc} style={{backgroundColor:"#3B82F6",borderRadius:10,paddingVertical:12,alignItems:"center",marginTop:4}}><Text style={{color:"#fff",fontWeight:"600"}}>Calculate</Text></TouchableOpacity>
            {calc && <View style={{backgroundColor:"#EFF6FF",borderRadius:10,padding:12,marginTop:10}}>
              {[["Final Velocity",`${calc.vFinal.toFixed(2)} m/s`],["Acceleration",`${calc.accel.toFixed(2)} m/s²`],["Weight",`${calc.weight.toFixed(3)} N`],["Net Force",`${calc.netForce.toFixed(3)} N`],["Drag Force",`${calc.drag.toFixed(3)} N`],...(calc.gForce!==null?[["G-Force ⚠️",`${calc.gForce.toFixed(1)} g`]]:[])].map(([l,v])=>(
                <View key={l} style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:4}}><Text style={{fontSize:13,color:"#374151"}}>{l}</Text><Text style={{fontSize:13,fontWeight:"700",color:l.includes("G-Force")?"#EF4444":"#1D4ED8"}}>{v}</Text></View>
              ))}
            </View>}
          </Card>
          <ActivitySubmitCard activityId="parachute" activityName="Parachute Drop Challenge" />
        </View>}


        {activeTab === 4 && <View>
          <Card><CTitle>How Parachutes Work</CTitle><Body>Gravity pulls downward. A parachute increases air resistance (drag) acting upward, slowing the fall and reducing impact force. Engineers improve designs through repeated testing.</Body></Card>
          <Card><CTitle>Key Formulas</CTitle>
            {[["Final Velocity","v = d ÷ t"],["Acceleration","a = Δv ÷ t"],["Net Force","F = m × a"],["Weight","W = m × 9.8"],["Drag","Drag = W − F"],["G-Force","g = (Δv ÷ t_c) ÷ 9.8"]].map(([n,f])=>(
              <View key={n} style={{flexDirection:"row",justifyContent:"space-between",paddingVertical:5,borderBottomWidth:1,borderBottomColor:"#F3F4F6"}}><Text style={{fontSize:13,color:"#374151"}}>{n}</Text><Text style={{fontSize:13,color:"#3B82F6"}}>{f}</Text></View>
            ))}
          </Card>
          <Card><CTitle>Curriculum Links</CTitle>{["ACSSU076/ACSSU117 – Forces affect motion","ACSIS124 – Planning investigations","ACTDEP036 – Test and improve solutions"].map(l=><Bullet key={l} text={l} bullet="📌"/>)}</Card>
        </View>}

      </ScrollView>
    </ScreenContainer>
  );
}

// ── Shared UI helpers (same across all 7 files) ──────────────────
function Header({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) {
  return (
    <View>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}><Text style={{ fontSize: 22, color: "#3B82F6" }}>←</Text></TouchableOpacity>
        <Text style={{ fontSize: 16, color: "#3B82F6", fontWeight: "600" }}>STEMM Lab</Text>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>{title}</Text>
        <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{subtitle}</Text>
      </View>
    </View>
  );
}
function TabBar({
  tabs,
  active,
  onPress,
}: {
  tabs: string[];
  active: number;
  onPress: (i: number) => void;
}) {
  return (
    <View
      style={{
        position: "sticky" as any,
        top: 0,
        zIndex: 50,
        backgroundColor: "#F9FAFB",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onPress(i)}
            style={{
              marginRight: 20,
              paddingBottom: 10,
              borderBottomWidth: active === i ? 2 : 0,
              borderBottomColor: "#3B82F6",
              height: 44,
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: active === i ? "600" : "400",
                color: active === i ? "#3B82F6" : "#9CA3AF",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
function Card({ children }: { children: React.ReactNode }) { return <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 16, marginBottom: 14 }}>{children}</View>; }
function CTitle({ children }: { children: React.ReactNode }) { return <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 10 }}>{children}</Text>; }
function Body({ children }: { children: React.ReactNode }) { return <Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21 }}>{children}</Text>; }
function Bullet({ text, bullet = "•" }: { text: string; bullet?: string }) { return <View style={{ flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" }}><Text style={{ fontSize: 14, color: "#9CA3AF" }}>{bullet}</Text><Text style={{ fontSize: 14, color: "#4B5563", lineHeight: 21, flex: 1 }}>{text}</Text></View>; }
function StepBadge({ n }: { n: number }) { return <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center", marginTop: 1 }}><Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{n}</Text></View>; }
function IField({ label, value, onChange, ph, kbt = "default" }: { label: string; value: string; onChange: (v: string) => void; ph?: string; kbt?: "default" | "decimal-pad" }) {
  return <View style={{ marginBottom: 8 }}><Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder={ph} placeholderTextColor="#D1D5DB" keyboardType={kbt} style={{ borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 8, paddingVertical: 7, paddingHorizontal: 10, fontSize: 14, color: "#111827", backgroundColor: "#FAFAFA" }} /></View>;
}
