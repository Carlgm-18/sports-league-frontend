import { useEffect, useState } from 'react';
import { LEAGUE_CARD_WIDTH, LeagueCard } from '@/components/ui/LeagueCard';
import { LoginButton } from '@/components/ui/LoginButton';
import CreateLeagueButton from '@/components/ui/league/CreateLeagueButton';
import { useAuth } from '@/hooks/authProvider';
import { getAllLeagues } from '@/services/LeagueService';
import { LeagueSummary } from '@/types/api';
import { Link } from 'expo-router';
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

const MIN_GAP = 24;
const PADDING_HORIZONTAL = 96;

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useAuth();
  const [leagues, setLeagues] = useState<LeagueSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagues = async () => {
      const result = await getAllLeagues();
      if (result.ok) {
        setLeagues(result.data);
      }
      setLoading(false);
    };
    fetchLeagues();
  }, []);

  const availableWidth = width - PADDING_HORIZONTAL;
  const numColumns = Math.max(
    1,
    Math.floor((availableWidth + MIN_GAP) / (LEAGUE_CARD_WIDTH + MIN_GAP)),
  );
  const gridWidth = numColumns * LEAGUE_CARD_WIDTH + (numColumns - 1) * MIN_GAP;

  return (
    <View className="flex-1 bg-gray-50">
      <LoginButton />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : leagues.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-gray-500 text-lg font-medium text-center">
            No hay ligas disponibles actualmente
          </Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={leagues}
          keyExtractor={(item) => item.leagueId.toString()}
          numColumns={numColumns}
          contentContainerStyle={{
            paddingVertical: 24,
            gap: 24,
            alignSelf: 'center',
            width: gridWidth,
          }}
          columnWrapperStyle={
            numColumns > 1 ? { gap: MIN_GAP, justifyContent: 'flex-start' } : undefined
          }
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: '/leagues/[leagueId]',
                params: { leagueId: item.leagueId },
              }}
              asChild
            >
              <Pressable className="active:opacity-85">
                <LeagueCard name={item.name} description={item.description} />
              </Pressable>
            </Link>
          )}
        />
      )}

      {isAuthenticated && (
        <CreateLeagueButton
          href="/leagues/new-league"
        />
      )}
    </View>
  );
}
