import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

interface ExpoConfig {
  expo: {
    android: { package: string };
    experiments: { typedRoutes: boolean };
    plugins: unknown[];
    updates: { enabled: boolean };
    userInterfaceStyle: string;
  };
}

const config = JSON.parse(
  readFileSync(new URL('../app.json', import.meta.url), 'utf8'),
) as ExpoConfig;

test('mobile configuration fails closed on product constraints', () => {
  assert.equal(config.expo.android.package, 'id.siagabunda.app');
  assert.equal(config.expo.experiments.typedRoutes, true);
  assert.equal(config.expo.updates.enabled, false);
  assert.equal(config.expo.userInterfaceStyle, 'light');
});

test('Android compile and target SDK are pinned to API 36', () => {
  const plugin = config.expo.plugins.find(
    (entry): entry is [string, { android: { compileSdkVersion: number; targetSdkVersion: number } }] =>
      Array.isArray(entry) && entry[0] === 'expo-build-properties',
  );

  if (!plugin) {
    throw new Error('expo-build-properties plugin is required');
  }
  assert.equal(plugin[1].android.compileSdkVersion, 36);
  assert.equal(plugin[1].android.targetSdkVersion, 36);
});
