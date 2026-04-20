import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import { useAuth } from "../../src/context/AuthContext";
import { useAccessibility } from "../../src/context/AccessibilityContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors, fontSize, fontFamily } = useAccessibility();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (size: number) => ({ fontSize: size + (fontSize - 14), fontFamily });

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.appTitle, { color: colors.primary, ...t(18) }]}>
            STEMM Lab
          </Text>

          <Text style={[styles.title, { color: colors.textMain, ...t(26) }]}>
            Welcome back
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSub, ...t(14) }]}>
            Sign in to continue
          </Text>

          {!!error && (
            <View style={[styles.errorBox, { borderColor: "#F87171", backgroundColor: "#FEF2F2" }]}>
              <Text style={[styles.errorText, t(13)]}>{error}</Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.textSub, ...t(12) }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textMain,
                ...t(15),
              },
            ]}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSub}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={[styles.label, { color: colors.textSub, ...t(12) }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textMain,
                ...t(15),
              },
            ]}
            placeholder="••••••••"
            placeholderTextColor={colors.textSub}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.buttonText, t(16)]}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSub, ...t(14) }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={[styles.link, { color: colors.primary, ...t(14) }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function friendlyError(code: string): string {
  switch (code) {
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/user-not-found": return "No account found with this email.";
    case "auth/wrong-password": return "Incorrect password.";
    case "auth/too-many-requests": return "Too many attempts. Try again later.";
    case "auth/invalid-credential": return "Incorrect email or password.";
    default: return "Something went wrong. Please try again.";
  }
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  appTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 40,
  },
  title: {
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 28,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {},
  link: {
    fontWeight: "600",
  },
});
