import { StyleSheet } from "react-native";
import { Theme } from "./theme";

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.screenPadding,
    paddingTop: 60,
  },

  headerTitle: {
    textAlign: "center",
    color: Theme.colors.primary,
    fontSize: Theme.text.appTitle,
    fontWeight: "600",
    marginBottom: Theme.spacing.xl,
  },

  mainTitle: {
    textAlign: "center",
    fontSize: Theme.text.mainTitle,
    fontWeight: "700",
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.sm,
  },

  subtitle: {
    textAlign: "center",
    fontSize: Theme.text.body,
    color: Theme.colors.textSub,
    marginBottom: Theme.spacing.xl,
  },

  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.spacing.buttonRadius,
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },

  buttonText: {
    color: "#fff",
    fontSize: Theme.text.button,
    fontWeight: "600",
  },

  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.spacing.borderRadius,
    padding: Theme.spacing.cardPadding,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.md,
  },
});