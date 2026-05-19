import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export const colors = {
  ink: '#17202A',
  mutedInk: '#64748B',
  surface: '#F8FAFC',
  panel: '#FFFFFF',
  border: '#E2E8F0',
  brand: '#0F766E',
  accent: '#2563EB',
  success: '#15803D',
  warning: '#B45309',
};

type ArchitectureCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ArchitectureCard({
  title,
  subtitle,
  children,
  style,
}: ArchitectureCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

type StatusPillProps = {
  label: string;
  tone?: 'brand' | 'accent' | 'success' | 'warning';
};

export function StatusPill({label, tone = 'brand'}: StatusPillProps) {
  const toneColor = colors[tone];

  return (
    <View
      style={[
        styles.pill,
        {borderColor: toneColor, backgroundColor: `${toneColor}1A`},
      ]}>
      <Text style={[styles.pillText, {color: toneColor}]}>{label}</Text>
    </View>
  );
}

type MetricTileProps = {
  label: string;
  value: string;
};

export function MetricTile({label, value}: MetricTileProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

type ModulePageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ModulePage({title, description, children}: ModulePageProps) {
  return (
    <View style={styles.page}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageDescription}>{description}</Text>
      <View style={styles.pageBody}>{children}</View>
    </View>
  );
}

export const typography = {
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  } satisfies TextStyle,
  body: {
    color: colors.mutedInk,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  cardBody: {
    gap: 14,
    marginTop: 16,
  },
  cardSubtitle: {
    ...typography.body,
    marginTop: 6,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  metric: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 136,
    padding: 14,
  },
  metricLabel: {
    color: colors.mutedInk,
    fontSize: 12,
    marginTop: 2,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  page: {
    gap: 8,
    padding: 24,
  },
  pageBody: {
    gap: 16,
    marginTop: 16,
  },
  pageDescription: typography.body,
  pageTitle: typography.title,
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
