import { LEAGUE_CARD_WIDTH, LeagueCard } from '@/components/ui/LeagueCard';
import { LoginButton } from '@/components/ui/LoginButton';
import CreateLeagueButton from '@/components/ui/league/CreateLeagueButton';
import { useAuth } from '@/hooks/authProvider';
import { Link } from 'expo-router';
import {
    FlatList,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';

const MOCK_LEAGUES = [
  { id: 1, name: 'Liga Universitaria', description: 'Torneo de primavera' },
  { id: 2, name: 'Liga de Verano', description: 'Partidos amistosos' },
  {
    id: 3,
    name: 'Liga de Verano',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta leo',
  },
  { id: 4, name: 'Liga de Verano', description: 'Partidos amistosos' },
  { id: 5, name: 'Liga de Verano', description: 'Partidos amistosos' },
  { id: 6, name: 'Liga de Verano', description: 'Partidos amistosos' },
  { id: 7, name: 'Liga de Verano', description: 'Partidos amistosos' },
];

const MIN_GAP = 24;
const PADDING_HORIZONTAL = 96;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useAuth();

  const availableWidth = width - PADDING_HORIZONTAL;
  const numColumns = Math.max(
    1,
    Math.floor((availableWidth + MIN_GAP) / (LEAGUE_CARD_WIDTH + MIN_GAP)),
  );
  const gridWidth = numColumns * LEAGUE_CARD_WIDTH + (numColumns - 1) * MIN_GAP;

  return (
    <View style={styles.container}>
      <LoginButton />
      <FlatList
        key={numColumns}
        data={MOCK_LEAGUES}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={[styles.listContent, { width: gridWidth }]}
        {...(numColumns > 1 ? { columnWrapperStyle: styles.gridRow } : {})}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/leagues/[leagueId]',
              params: { leagueId: item.id },
            }}
            asChild
          >
            <Pressable>
              <LeagueCard name={item.name} description={item.description} />
            </Pressable>
          </Link>
        )}
      />

      {isAuthenticated && (
        <CreateLeagueButton
          href="/leagues/new-league"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: {
    paddingVertical: 24,
    gap: 24,
    // NUEVO: Centra el contenedor entero en la pantalla, en lugar de centrar su contenido
    alignSelf: 'center',
  },
  gridRow: {
    gap: MIN_GAP,
    justifyContent: 'flex-start', // Ahora sí alinea la huérfana a la izquierda de la fila
  },
});
