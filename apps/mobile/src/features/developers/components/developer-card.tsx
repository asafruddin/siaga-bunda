import { Image, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/theme';
import type { Developer } from '../lib/developers';

export function DeveloperCard({ developer }: { developer: Developer }) {
  const { nama_peneliti, nomor_induk, instansi, institutionLogo, photo } =
    developer;

  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.row}>
        <View style={styles.photoFrame}>
          <Image
            accessibilityLabel={`Foto ${nama_peneliti}`}
            source={photo}
            style={styles.photo}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.name}>{nama_peneliti}</Text>
          <View style={styles.institutionBadge}>
            {institutionLogo ? (
              <Image
                accessibilityLabel={`Logo ${instansi}`}
                resizeMode="contain"
                source={institutionLogo}
                style={styles.institutionLogo}
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  accessible={false}
                  color={colors.primary}
                  name="school-outline"
                  size={17}
                />
                <Text style={styles.meta}>{instansi}</Text>
              </>
            )}
          </View>
          <View style={styles.identifierPill}>
            <MaterialCommunityIcons
              accessible={false}
              color={colors.primaryDark}
              name="card-account-details-outline"
              size={15}
            />
            <Text style={styles.identifier}>
              <Text style={styles.identifierType}>{nomor_induk.jenis}</Text>{' '}
              {nomor_induk.nomor}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  accent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 5,
    backgroundColor: colors.primary,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  photoFrame: {
    width: 78,
    height: 78,
    padding: 3,
    borderRadius: 39,
    backgroundColor: colors.pink,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.purple,
  },
  copy: { flex: 1, gap: 8 },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 21,
  },
  institutionBadge: {
    alignSelf: 'flex-start',
    minHeight: 38,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  institutionLogo: { width: 139, height: 28 },
  meta: {
    flexShrink: 1,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  identifierPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.pink,
  },
  identifier: {
    flexShrink: 1,
    color: colors.primaryDark,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
  },
  identifierType: { fontWeight: '900' },
});
