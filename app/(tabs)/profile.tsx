import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import CustomButton from "../../src/components/CustomButton";
import { useAuth } from "../../src/context/AuthContext";
import { useAccessibility } from "../../src/context/AccessibilityContext";
import { getLeaderboard, LeaderboardEntry } from "../../src/services/firestoreService";

export default function ProfileScreen() {
  const router = useRouter();
  const { teamName, teamCode, teamId, memberNames } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(true);

  const t = (size: number) => ({ fontSize: size + (fontSize - 14), fontFamily });

  useEffect(() => {
    getLeaderboard(10)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]))
      .finally(() => setLbLoading(false));
  }, []);

  const myRank = leaderboard.findIndex((e) => e.id === teamId);
  const myEntry = leaderboard.find((e) => e.id === teamId);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 70, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ textAlign: "center", ...t(fontSize + 4), color: colors.primary, fontWeight: "600", marginBottom: 30 }}>
          STEMM Lab
        </Text>

        <Text style={{ textAlign: "center", ...t(fontSize + 8), fontWeight: "700", marginBottom: 20, color: colors.textMain }}>
          Team Profile
        </Text>

        {/* Team info card */}
        <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
          <Text style={{ ...t(fontSize + 4), fontWeight: "700", color: colors.textMain, marginBottom: 4 }}>
            {teamName || "—"}
          </Text>
          {!!teamCode && (
            <Text style={{ ...t(fontSize - 1), color: colors.textSub, marginBottom: 12 }}>
              Team Code: {teamCode}
            </Text>
          )}

          {memberNames.length > 0 && (
            <>
              <Text style={{ ...t(fontSize - 1), fontWeight: "600", color: colors.textSub, marginBottom: 6 }}>
                Members
              </Text>
              {memberNames.map((name, i) => (
                <Text key={i} style={{ ...t(fontSize - 1), color: colors.textMain, marginBottom: 3 }}>
                  {i + 1}. {name}
                </Text>
              ))}
            </>
          )}

          {myEntry && (
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Text style={{ ...t(fontSize - 1), color: colors.textSub, marginBottom: 2 }}>
                Experiments Completed: {myEntry.experimentsCompleted}
              </Text>
              <Text style={{ ...t(fontSize - 1), color: colors.textSub }}>
                Total Score: {myEntry.totalScore} pts
              </Text>
            </View>
          )}
        </View>

        {/* Leaderboard card */}
        <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 }}>
          <Text style={{ ...t(fontSize), fontWeight: "600", color: colors.textMain, marginBottom: 12 }}>
            Leaderboard
          </Text>

          {lbLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : leaderboard.length === 0 ? (
            <Text style={{ ...t(fontSize - 1), color: colors.textSub, textAlign: "center", paddingVertical: 12 }}>
              No teams yet. Complete an activity to appear here!
            </Text>
          ) : (
            leaderboard.map((entry, i) => {
              const isMyTeam = entry.id === teamId;
              return (
                <View
                  key={entry.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    marginBottom: 4,
                    backgroundColor: isMyTeam ? colors.primarySelected : "transparent",
                    borderWidth: isMyTeam ? 1 : 0,
                    borderColor: isMyTeam ? colors.primary : "transparent",
                  }}
                >
                  <Text style={{ ...t(fontSize - 1), fontWeight: "700", color: colors.textSub, width: 28 }}>
                    {i + 1}.
                  </Text>
                  <Text style={{ ...t(fontSize - 1), flex: 1, color: isMyTeam ? colors.primary : colors.textMain, fontWeight: isMyTeam ? "600" : "400" }}>
                    {entry.teamName}
                  </Text>
                  <Text style={{ ...t(fontSize - 1), color: colors.textSub, marginRight: 12 }}>
                    {entry.experimentsCompleted} exp
                  </Text>
                  <Text style={{ ...t(fontSize - 1), fontWeight: "700", color: isMyTeam ? colors.primary : colors.textMain }}>
                    {entry.totalScore} pts
                  </Text>
                </View>
              );
            })
          )}

          {myRank >= 0 && (
            <Text style={{ ...t(fontSize - 1), color: colors.primary, fontWeight: "600", marginTop: 10, textAlign: "center" }}>
              Your team is ranked #{myRank + 1}
            </Text>
          )}
        </View>

        <CustomButton
          title="View Activities"
          onPress={() => router.push("/(tabs)/activity-hub")}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
