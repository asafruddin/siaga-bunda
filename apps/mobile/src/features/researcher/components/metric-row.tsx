import { Text, View } from 'react-native';
import { ui } from '@/components/ui';

export function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={ui.muted}>{label}</Text>
      <Text style={ui.label}>{value}</Text>
    </View>
  );
}
