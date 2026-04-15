// app/activities/handfan.tsx


import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ConductTab from "../../src/components/Conducttab";
import ScreenContainer from "../../src/components/ScreenContainer";

const TAB_LABELS = ["Overview", "Instructions", "Conduct", "Result", "Science"];
const MATERIALS = [
  { name: "Thin printer paper", k: 0.05, thickness: "0.1 mm" },
  { name: "Standard card stock", k: 0.2, thickness: "0.25 mm" },
  { name: "Thin cardboard", k: 0.5, thickness: "0.5 mm" },
  { name: "Corrugated cardboard", k: 2.5, thickness: "3 mm" },
];
type DesignRow = { label: string; prediction: string; outcome: string; notes: string };

export default function HandFanScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [bendAngle, setBendAngle] = useState("");
  const [forceResult, setForceResult] = useState<string | null>(null);
  const [designs, setDesigns] = useState<DesignRow[]>([
    { label: "Design 1 – 1cm back-and-forward folds", prediction: "30°", outcome: "", notes: "" },
    { label: "Design 2 – No folds (flat)", prediction: "", outcome: "", notes: "" },
    { label: "Design 3 – Custom design", prediction: "", outcome: "", notes: "" },
  ]);

  const calcForce = () => {
    const deg = parseFloat(bendAngle);
    if (isNaN(deg) || deg <= 0) { setForceResult("Invalid angle"); return; }
    const k = MATERIALS[selectedMaterial].k, theta = (deg * Math.PI) / 180;
    setForceResult(`F ≈ ${(k * theta).toFixed(4)} N  (k=${k}, θ=${deg}°)`);
  };
  const updateDesign = (i: number, f: keyof DesignRow, v: string) => { const u = [...designs]; u[i] = { ...u[i], [f]: v }; setDesigns(u); };

  const sensorSummary: Record<string, string> = {};
  designs.forEach((d, i) => { if (d.outcome) sensorSummary[`Design ${i + 1} bend`] = `${d.outcome}°`; });
  if (forceResult) sensorSummary["Calculated Force"] = forceResult;

  return (
    <ScreenContainer>
      <Header onBack={() => router.back()} title="🌬 Hand Fan Challenge" subtitle="Physics – Air Movement" />
      <TabBar tabs={TAB_LABELS} active={activeTab} onPress={setActiveTab} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {activeTab === 0 && <View>
          <Card><CTitle>Overview</CTitle><Body>Students test how air movement affects flexible materials by fanning paper and cardboard at different distances. Record how far each material bends.</Body></Card>
          <Card><CTitle>Equipment Needed</CTitle>{["Paper and cardboard","Scissors","Sticky tape","Mobile phone","Ruler"].map(e=><Bullet key={e} text={e}/>)}</Card>
          <Card><CTitle>Write-Up Prompts</CTitle>{["Predict which fan design makes the paper move the most.","How does material stiffness affect the bend angle?","How does fan design influence air velocity?","How does distance affect bending?"].map(p=><Bullet key={p} text={p} bullet="›"/>)}</Card>
        </View>}

        {activeTab === 1 && <View>
          <Card><CTitle>Step-by-Step Instructions</CTitle>
          <Image
      source={require("../../assets/images/handfan.png")}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 14,
        resizeMode: "contain",
      }}
    />
            {["Stand paper upright on a table.","Fan air from 30 cm away using Design 1.","Observe and record the bend angle in degrees.","Repeat at 15 cm and 45 cm distances.","Try Design 2 and Design 3.","Repeat all tests using cardboard.","Record a video of each fan test in the Conduct tab."].map((s,i)=>(
              <View key={i} style={{flexDirection:"row",gap:8,marginBottom:10,alignItems:"flex-start"}}><StepBadge n={i+1}/><Text style={{flex:1,fontSize:14,color:"#4B5563",lineHeight:21}}>{s}</Text></View>
            ))}
          </Card>
          <Card><CTitle>Fan Distances</CTitle>{["15 cm – close range","30 cm – standard","45 cm – far range"].map(d=><Bullet key={d} text={d}/>)}</Card>
        </View>}

        {activeTab === 2 && (
          <ConductTab
            activityTitle="Hand Fan Challenge"
            videoSlots={[
              { id: "design1", label: "Design 1 – Fan test video", hint: "Stand paper upright. Film from the side to see the bend angle clearly." },
              { id: "design2", label: "Design 2 – Fan test video", hint: "Keep the same distance (30 cm) for fair comparison." },
              { id: "design3", label: "Design 3 – Fan test video", hint: "Try to capture the maximum bend point." },
              { id: "cardboard", label: "Cardboard comparison video", hint: "Same test with cardboard to compare stiffness." },
            ]}
            sensorSummary={sensorSummary}
            onSubmit={data => console.log("HandFan submitted:", data)}
          />
        )}

        {activeTab === 3 && <View>
          <Card><CTitle>📊 Results Table</CTitle>
            {designs.map((d,i)=>(
              <View key={i} style={{backgroundColor:"#F9FAFB",borderRadius:10,padding:12,marginBottom:12,borderWidth:1,borderColor:"#E5E7EB"}}>
                <Text style={{fontSize:13,fontWeight:"600",color:"#374151",marginBottom:8}}>{d.label}</Text>
                <IField label="Prediction (bend in °)" value={d.prediction} onChange={v=>updateDesign(i,"prediction",v)} ph="e.g. 30°" kbt="decimal-pad"/>
                <IField label="Observed bend angle (°)" value={d.outcome} onChange={v=>updateDesign(i,"outcome",v)} ph="e.g. 28°" kbt="decimal-pad"/>
                <IField label="Observations / Were you right?" value={d.notes} onChange={v=>updateDesign(i,"notes",v)} ph="Notes…"/>
              </View>
            ))}
          </Card>
          <Card><CTitle>🔢 Force Calculator (Optional)</CTitle>
            <Text style={{fontSize:13,color:"#6B7280",marginBottom:10}}>Estimate force using F ≈ k × θ</Text>
            {MATERIALS.map((m,i)=>(
              <TouchableOpacity key={m.name} onPress={()=>{setSelectedMaterial(i);setForceResult(null);}}
                style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:selectedMaterial===i?"#EFF6FF":"#F9FAFB",borderRadius:8,padding:10,marginBottom:6,borderWidth:1,borderColor:selectedMaterial===i?"#3B82F6":"#E5E7EB"}}>
                <Text style={{fontSize:13,color:selectedMaterial===i?"#1D4ED8":"#374151",fontWeight:selectedMaterial===i?"600":"400"}}>{m.name}</Text>
                <Text style={{fontSize:12,color:"#9CA3AF"}}>k={m.k}</Text>
              </TouchableOpacity>
            ))}
            <IField label="Measured bend angle (°)" value={bendAngle} onChange={v=>{setBendAngle(v);setForceResult(null);}} ph="e.g. 30" kbt="decimal-pad"/>
            <TouchableOpacity onPress={calcForce} style={{backgroundColor:"#3B82F6",borderRadius:10,paddingVertical:12,alignItems:"center",marginTop:4}}><Text style={{color:"#fff",fontWeight:"600"}}>Calculate Force</Text></TouchableOpacity>
            {forceResult&&<View style={{backgroundColor:"#EFF6FF",borderRadius:10,padding:12,marginTop:10}}><Text style={{fontSize:14,color:"#1D4ED8",fontWeight:"600"}}>{forceResult}</Text></View>}
          </Card>
        </View>}

        
        {activeTab === 4 && <View>
          <Card><CTitle>How Air Force Works</CTitle><Body>Moving air applies force to objects. Paper bends due to flexibility. F ≈ k × θ relates force to material stiffness (k) and bend angle (θ in radians). Repeated bending weakens the material.</Body></Card>
          <Card><CTitle>Stiffness Reference</CTitle>
            {MATERIALS.map(m=>(
              <View key={m.name} style={{flexDirection:"row",paddingVertical:6,borderBottomWidth:1,borderBottomColor:"#F3F4F6"}}>
                <Text style={{flex:2,fontSize:13,color:"#374151"}}>{m.name}</Text>
                <Text style={{flex:1,fontSize:13,color:"#6B7280"}}>{m.thickness}</Text>
                <Text style={{fontSize:13,color:"#3B82F6",fontWeight:"600"}}>k={m.k}</Text>
              </View>
            ))}
          </Card>
          <Card><CTitle>Curriculum Links</CTitle><Bullet text="ACSSU076 – Forces and motion" bullet="📌"/></Card>
        </View>}

      </ScrollView>
    </ScreenContainer>
  );
}

function Header({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) { return <View><View style={{paddingTop:60,paddingHorizontal:20,paddingBottom:10,flexDirection:"row",alignItems:"center"}}><TouchableOpacity onPress={onBack} style={{marginRight:12}}><Text style={{fontSize:22,color:"#3B82F6"}}>←</Text></TouchableOpacity><Text style={{fontSize:16,color:"#3B82F6",fontWeight:"600"}}>STEMM Lab</Text></View><View style={{paddingHorizontal:20,marginBottom:8}}><Text style={{fontSize:20,fontWeight:"700",color:"#1F2937"}}>{title}</Text><Text style={{fontSize:13,color:"#9CA3AF",marginTop:2}}>{subtitle}</Text></View></View>; }
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
function Card({ children }: { children: React.ReactNode }) { return <View style={{backgroundColor:"#fff",borderRadius:14,borderWidth:1,borderColor:"#E5E7EB",padding:16,marginBottom:14}}>{children}</View>; }
function CTitle({ children }: { children: React.ReactNode }) { return <Text style={{fontSize:15,fontWeight:"700",color:"#1F2937",marginBottom:10}}>{children}</Text>; }
function Body({ children }: { children: React.ReactNode }) { return <Text style={{fontSize:14,color:"#4B5563",lineHeight:21}}>{children}</Text>; }
function Bullet({ text, bullet = "•" }: { text: string; bullet?: string }) { return <View style={{flexDirection:"row",gap:8,marginBottom:6,alignItems:"flex-start"}}><Text style={{fontSize:14,color:"#9CA3AF"}}>{bullet}</Text><Text style={{fontSize:14,color:"#4B5563",lineHeight:21,flex:1}}>{text}</Text></View>; }
function StepBadge({ n }: { n: number }) { return <View style={{width:24,height:24,borderRadius:12,backgroundColor:"#3B82F6",alignItems:"center",justifyContent:"center",marginTop:1}}><Text style={{color:"#fff",fontSize:12,fontWeight:"700"}}>{n}</Text></View>; }
function IField({ label, value, onChange, ph, kbt = "default" }: { label: string; value: string; onChange: (v: string) => void; ph?: string; kbt?: "default" | "decimal-pad" }) { return <View style={{marginBottom:8}}><Text style={{fontSize:12,color:"#6B7280",marginBottom:3}}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder={ph} placeholderTextColor="#D1D5DB" keyboardType={kbt} style={{borderWidth:1,borderColor:"#E5E7EB",borderRadius:8,paddingVertical:7,paddingHorizontal:10,fontSize:14,color:"#111827",backgroundColor:"#FAFAFA"}}/></View>; }

