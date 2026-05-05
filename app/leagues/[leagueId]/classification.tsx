import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MOCK_STANDINGS = [
  { id: 1, name: 'Los Espartanos', pj: 10, g: 8, e: 1, p: 1, pts: 25 },
  { id: 2, name: 'Real Bañil', pj: 10, g: 7, e: 2, p: 1, pts: 23 },
  { id: 3, name: 'Rayo Vayacaño', pj: 10, g: 5, e: 3, p: 2, pts: 18 },
  { id: 4, name: 'Aston Birra', pj: 10, g: 2, e: 1, p: 7, pts: 7 },
];

export default function ClassificationTab() {
  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.cellPos]}>#</Text>
          <Text style={[styles.cell, styles.cellTeam]}>Equipo</Text>
          <Text style={[styles.cell, styles.cellStat]}>PJ</Text>
          <Text style={[styles.cell, styles.cellStat, styles.bold]}>PTS</Text>
        </View>
        {MOCK_STANDINGS.map((team, index) => (
          <View key={team.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.cellPos]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.cellTeam]}>{team.name}</Text>
            <Text style={[styles.cell, styles.cellStat]}>{team.pj}</Text>
            <Text
              style={[
                styles.cell,
                styles.cellStat,
                styles.bold,
                styles.textBlue,
              ]}
            >
              {team.pts}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: {
    padding: 16,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cell: { fontSize: 14, color: '#111827' },
  cellPos: { width: 30, color: '#6B7280' },
  cellTeam: { flex: 1 },
  cellStat: { width: 40, textAlign: 'center' },
  bold: { fontWeight: 'bold' },
  textBlue: { color: '#2196F3' },
});
