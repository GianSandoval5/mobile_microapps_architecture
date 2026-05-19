import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  MicroAppModule,
  ModuleRegistry,
  SessionContract,
  useSessionUser,
} from '../packages/module_contracts';
import {
  ArchitectureCard,
  colors,
  MetricTile,
  StatusPill,
  typography,
} from '../packages/shared_ui';

type MicroappsShellProps = {
  registry: ModuleRegistry;
  session: SessionContract;
};

export function MicroappsShell({registry, session}: MicroappsShellProps) {
  const [selectedRoutePath, setSelectedRoutePath] = useState(
    registry.initialRoute.path,
  );
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const route = registry.routeByPath(selectedRoutePath);
  const selectedModule = registry.moduleForRoute(route.path);
  const SelectedScreen = route.component;
  const isWide = width >= 900;

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      {isWide ? (
        <View style={styles.desktop}>
          <NavigationPanel
            registry={registry}
            selectedModule={selectedModule}
            onSelectRoute={setSelectedRoutePath}
          />
          <View style={styles.content}>
            <ShellHeader
              registry={registry}
              selectedModule={selectedModule}
              session={session}
            />
            <ScrollView contentContainerStyle={styles.screenScroll}>
              <SelectedScreen />
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <MobileHeader
            registry={registry}
            selectedModule={selectedModule}
            onSelectRoute={setSelectedRoutePath}
          />
          <ShellHeader
            registry={registry}
            selectedModule={selectedModule}
            session={session}
          />
          <ScrollView contentContainerStyle={styles.screenScroll}>
            <SelectedScreen />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

type NavigationProps = {
  registry: ModuleRegistry;
  selectedModule: MicroAppModule;
  onSelectRoute(path: string): void;
};

function NavigationPanel({
  registry,
  selectedModule,
  onSelectRoute,
}: NavigationProps) {
  return (
    <View style={styles.navigationPanel}>
      <Text style={styles.logo}>mobile_microapps_architecture</Text>
      <Text style={styles.logoSubtitle}>React Native enterprise reference</Text>
      <View style={styles.navList}>
        {registry.modules.map(module => (
          <ModuleNavItem
            key={module.id}
            module={module}
            selected={module.id === selectedModule.id}
            onPress={() => onSelectRoute(module.initialRoute)}
          />
        ))}
      </View>
      <ArchitectureCard
        title="Shared packages"
        subtitle="Contracts, network and UI are imported as local TypeScript boundaries.">
        <View style={styles.pillRow}>
          <StatusPill label="module_contracts" />
          <StatusPill label="core_network" tone="accent" />
          <StatusPill label="shared_ui" tone="success" />
        </View>
      </ArchitectureCard>
    </View>
  );
}

function MobileHeader({
  registry,
  selectedModule,
  onSelectRoute,
}: NavigationProps) {
  return (
    <View style={styles.mobileHeader}>
      <Text style={styles.logo}>Mobile Microapps</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.mobileTabs}>
          {registry.modules.map(module => (
            <Pressable
              key={module.id}
              onPress={() => onSelectRoute(module.initialRoute)}
              style={[
                styles.mobileTab,
                module.id === selectedModule.id && styles.mobileTabSelected,
              ]}>
              <Text
                style={[
                  styles.mobileTabText,
                  module.id === selectedModule.id &&
                    styles.mobileTabTextSelected,
                ]}>
                {module.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type ModuleNavItemProps = {
  module: MicroAppModule;
  selected: boolean;
  onPress(): void;
};

function ModuleNavItem({module, selected, onPress}: ModuleNavItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.navItem,
        selected && styles.navItemSelected,
        pressed && styles.navItemPressed,
      ]}>
      <View style={[styles.moduleIcon, selected && styles.moduleIconSelected]}>
        <Text
          style={[
            styles.moduleIconText,
            selected && styles.moduleIconTextSelected,
          ]}>
          {module.icon}
        </Text>
      </View>
      <View style={styles.navText}>
        <Text style={styles.navTitle}>{module.name}</Text>
        <Text numberOfLines={2} style={styles.navDescription}>
          {module.description}
        </Text>
      </View>
    </Pressable>
  );
}

type ShellHeaderProps = {
  registry: ModuleRegistry;
  selectedModule: MicroAppModule;
  session: SessionContract;
};

function ShellHeader({registry, selectedModule, session}: ShellHeaderProps) {
  const user = useSessionUser(session);

  return (
    <View style={styles.shellHeader}>
      <View style={styles.shellTitle}>
        <Text style={typography.title}>{selectedModule.name}</Text>
        <Text style={typography.body}>
          Mounted by shell through MicroAppModule contract
        </Text>
      </View>
      <View style={styles.metrics}>
        <MetricTile label="Microapps" value={`${registry.modules.length}`} />
        <MetricTile label="Routes" value={`${registry.routes.length}`} />
        <MetricTile
          label="Session contract"
          value={user ? user.segment : 'Guest'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  desktop: {
    flex: 1,
    flexDirection: 'row',
  },
  logo: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  logoSubtitle: {
    color: colors.mutedInk,
    fontSize: 12,
    marginTop: 6,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mobileHeader: {
    backgroundColor: colors.panel,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 14,
    padding: 16,
  },
  mobileTab: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  mobileTabSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  mobileTabText: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '800',
  },
  mobileTabTextSelected: {
    color: '#FFFFFF',
  },
  mobileTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  moduleIcon: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  moduleIconSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  moduleIconText: {
    color: colors.mutedInk,
    fontWeight: '900',
  },
  moduleIconTextSelected: {
    color: '#FFFFFF',
  },
  navDescription: {
    color: colors.mutedInk,
    fontSize: 12,
    lineHeight: 16,
  },
  navItem: {
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  navItemPressed: {
    opacity: 0.85,
  },
  navItemSelected: {
    backgroundColor: '#0F766E1A',
  },
  navList: {
    gap: 8,
    marginVertical: 24,
  },
  navText: {
    flex: 1,
    gap: 2,
  },
  navTitle: {
    color: colors.ink,
    fontWeight: '800',
  },
  navigationPanel: {
    backgroundColor: colors.panel,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    padding: 20,
    width: 320,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  screenScroll: {
    flexGrow: 1,
  },
  shellHeader: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  shellTitle: {
    gap: 4,
    minWidth: 260,
  },
});
