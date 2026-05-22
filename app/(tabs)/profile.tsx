import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import ScreenContainer from "../../src/components/ScreenContainer";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { useAuth } from "../../src/context/AuthContext";
import { getBatteryLevel, isCharging } from "../../src/services/batteryService";
import { getUserLocation } from "../../src/services/locationService";
import { getLeaderboardWithCache, LeaderboardEntry } from "../../src/services/firestoreService";

export default function ProfileScreen() {
  const { teamName, teamCode, teamId, memberNames, yearLevel } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [location, setLocation] = useState<any>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  const t = (size: number, extra?: object) => ({
    fontSize: size + (fontSize - 14),
    fontFamily,
    ...extra,
  });

  useEffect(() => {
    getLeaderboardWithCache(10)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]))
      .finally(() => setLbLoading(false));

    getUserLocation().then(setLocation);
    getBatteryLevel().then(setBattery);
    isCharging().then(setCharging);
  }, []);

  const myRank = leaderboard.findIndex((e) => e.id === teamId);
  const myEntry = leaderboard.find((e) => e.id === teamId);
  const teamInitial = (teamName || "T").charAt(0).toUpperCase();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero header ── */}
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5,
          }}>
            <Text style={{ fontSize: 34, fontWeight: "800", color: "#fff", fontFamily }}>
              {teamInitial}
            </Text>
          </View>

          <Text style={{ ...t(22), fontWeight: "800", color: colors.textMain, marginBottom: 6, letterSpacing: -0.4 }}>
            {teamName || "Your Team"}
          </Text>

          {!!teamCode && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 5,
              gap: 6,
            }}>
              <Text style={{ ...t(11), color: colors.textSub }}>Team Code</Text>
              <View style={{ width: 1, height: 10, backgroundColor: colors.border }} />
              <Text style={{ ...t(11), color: colors.primary, fontWeight: "700", letterSpacing: 1.2 }}>
                {teamCode}
              </Text>
            </View>
          )}
        </View>

        {/* ── Stat tiles ── */}
        {myEntry && (
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            <View style={{
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 28, fontWeight: "800", color: colors.primary, fontFamily, marginBottom: 4 }}>
                {myEntry.experimentsCompleted}
              </Text>
              <Text style={{ ...t(11), color: colors.textSub, textAlign: "center" }}>
                Experiments{"\n"}Completed
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: colors.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              alignItems: "center",
            }}>
              <Text style={{ fontSize: 28, fontWeight: "800", color: colors.primary, fontFamily, marginBottom: 4 }}>
                {myEntry.totalScore}
              </Text>
              <Text style={{ ...t(11), color: colors.textSub, textAlign: "center" }}>
                Total{"\n"}Points
              </Text>
            </View>
          </View>
        )}

        {/* ── Members ── */}
        {memberNames.length > 0 && (
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 8 }}>
              <Text style={{ ...t(13), fontWeight: "700", color: colors.textMain, letterSpacing: 0.2 }}>
                Team Members
              </Text>
              {!!yearLevel && (
                <>
                  <View style={{ width: 1, height: 14, backgroundColor: colors.border }} />
                  <Text style={{ ...t(12), color: colors.textSub, fontWeight: "500" }}>
                    {yearLevel}
                  </Text>
                </>
              )}
            </View>
            <View style={{ gap: 10 }}>
              {memberNames.map((name, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.primary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ ...t(13), fontWeight: "700", color: colors.primary }}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ ...t(14), color: colors.textMain, fontWeight: "500" }}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Leaderboard ── */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          marginBottom: 16,
        }}>
          <Text style={{ ...t(13), fontWeight: "700", color: colors.textMain, marginBottom: 12, letterSpacing: 0.2 }}>
            Leaderboard
          </Text>

          {/* Rank banner */}
          {myRank >= 0 && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.primary + "15",
              borderWidth: 1,
              borderColor: colors.primary + "40",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 14,
              marginBottom: 14,
              gap: 8,
            }}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
              <Text style={{ ...t(13), color: colors.primary, fontWeight: "700", flex: 1 }}>
                Ranked #{myRank + 1} of {leaderboard.length} teams
              </Text>
            </View>
          )}

          {lbLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : leaderboard.length === 0 ? (
            <Text style={{ ...t(12), color: colors.textSub, textAlign: "center", paddingVertical: 12 }}>
              No teams yet. Complete an activity to appear here!
            </Text>
          ) : (
            <View style={{ gap: 4 }}>
              {leaderboard.map((entry, i) => {
                const isMyTeam = entry.id === teamId;
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                return (
                  <View
                    key={entry.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 9,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: isMyTeam ? colors.primary + "12" : "transparent",
                      borderWidth: isMyTeam ? 1 : 0,
                      borderColor: isMyTeam ? colors.primary + "50" : "transparent",
                    }}
                  >
                    <Text style={{ width: 28, fontSize: 15 }}>
                      {medal ?? `${i + 1}.`}
                    </Text>
                    <Text style={{
                      ...t(13),
                      flex: 1,
                      color: isMyTeam ? colors.primary : colors.textMain,
                      fontWeight: isMyTeam ? "700" : "400",
                    }}>
                      {entry.teamName}
                    </Text>
                    <Text style={{ ...t(12), color: colors.textSub, marginRight: 10 }}>
                      {entry.experimentsCompleted} exp
                    </Text>
                    <Text style={{ ...t(13), fontWeight: "700", color: isMyTeam ? colors.primary : colors.textMain }}>
                      {entry.totalScore} pts
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Device ── */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}>
          <View style={{ padding: 16, paddingBottom: 12 }}>
            <Text style={{ ...t(13), fontWeight: "700", color: colors.textMain, letterSpacing: 0.2 }}>
              Device
            </Text>
          </View>

          {/* Location */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <Text style={{ ...t(11), fontWeight: "600", color: colors.textSub, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Location
            </Text>
          </View>

          {location ? (
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            </MapView>
          ) : (
            <View style={[styles.map, { alignItems: "center", justifyContent: "center", backgroundColor: colors.border }]}>
              <ActivityIndicator color={colors.primary} />
              <Text style={{ ...t(12), color: colors.textSub, marginTop: 8 }}>Fetching location…</Text>
            </View>
          )}

          {/* Battery */}
          <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
            <Text style={{ ...t(11), fontWeight: "600", color: colors.textSub, letterSpacing: 0.8, textTransform: "uppercase" }}>
              Battery
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingBottom: 14 }}>
            <Text style={{ fontSize: 16 }}>{charging ? "⚡" : "🔋"}</Text>
            <Text style={{ ...t(13), color: colors.textSub }}>
              {battery !== null ? `${battery}%` : "Loading…"}
              {charging ? "  ·  Charging" : ""}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 180,
  },
});
