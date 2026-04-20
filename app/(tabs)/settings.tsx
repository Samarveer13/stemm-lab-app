import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import {
  useAccessibility,
  ThemeColors,
  TextStyle,
  TextSize,
  FONT_FAMILY_MAP,
} from "../../src/context/AccessibilityContext";

// ── sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.sectionHeader, { color }]}>{label.toUpperCase()}</Text>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ThemeColors;
}
function ToggleRow({ label, description, value, onValueChange, colors }: ToggleRowProps) {
  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.textMain }]}>{label}</Text>
        <Text style={[styles.rowDesc, { color: colors.textSub }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: colors.toggleTrack }}
        thumbColor="#FFFFFF"
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
  colors: ThemeColors;
  previewFont?: (value: T) => string | undefined;
}
function ChipGroup<T extends string>({
  options, selected, onSelect, colors, previewFont,
}: ChipGroupProps<T>) {
  return (
    <View style={styles.chipRow}>
      {options.map(({ value, label }) => {
        const isSelected = value === selected;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onSelect(value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={label}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? "#FFFFFF" : colors.textMain,
                  fontFamily: previewFont ? previewFont(value) : undefined,
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── screen ────────────────────────────────────────────────────────────────────

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "small", label: "S" },
  { value: "medium", label: "M" },
  { value: "large", label: "L" },
  { value: "xlarge", label: "XL" },
];

const TEXT_STYLE_OPTIONS: { value: TextStyle; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

export default function SettingsScreen() {
  const {
    darkMode, setDarkMode,
    highContrast, setHighContrast,
    textStyle, setTextStyle,
    textSize, setTextSize,
    colors, fontSize, fontFamily,
  } = useAccessibility();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.appTitle, { color: colors.primary }]}>STEMM Lab</Text>
        <Text style={[styles.pageTitle, { color: colors.textMain }]}>Settings</Text>

        {/* ── Display ── */}
        <SectionHeader label="Display" color={colors.sectionLabel} />

        <ToggleRow
          label="Dark Mode"
          description="Switch to a dark colour scheme"
          value={darkMode}
          onValueChange={setDarkMode}
          colors={colors}
        />

        <ToggleRow
          label="High Contrast"
          description="Increase contrast for better readability"
          value={highContrast}
          onValueChange={setHighContrast}
          colors={colors}
        />

        {/* ── Text ── */}
        <SectionHeader label="Text" color={colors.sectionLabel} />

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.textMain, marginBottom: 4 }]}>
            Text Size
          </Text>
          <Text style={[styles.rowDesc, { color: colors.textSub, marginBottom: 12 }]}>
            Adjust how large text appears across the app
          </Text>
          <ChipGroup
            options={TEXT_SIZE_OPTIONS}
            selected={textSize}
            onSelect={setTextSize}
            colors={colors}
          />
          <Text
            style={[
              styles.previewText,
              { color: colors.textSub, fontSize, fontFamily, borderColor: colors.border },
            ]}
          >
            Preview — The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.textMain, marginBottom: 4 }]}>
            Text Style
          </Text>
          <Text style={[styles.rowDesc, { color: colors.textSub, marginBottom: 12 }]}>
            Choose the typeface used throughout the app
          </Text>
          <ChipGroup
            options={TEXT_STYLE_OPTIONS}
            selected={textStyle}
            onSelect={setTextStyle}
            colors={colors}
            previewFont={(v) => FONT_FAMILY_MAP[v]}
          />
          <Text
            style={[
              styles.previewText,
              { color: colors.textSub, fontSize, fontFamily, borderColor: colors.border },
            ]}
          >
            Preview — The quick brown fox jumps over the lazy dog.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  appTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  pageTitle: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  previewText: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    lineHeight: 22,
  },
});
