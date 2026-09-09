import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getLeagueMatches } from '@/services/LeagueService';
import { MatchCard } from '@/components/ui/MatchCard';
import { MatchDetails } from '@/types/api';

export default function MatchesTab() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!leagueId) return;
      const result = await getLeagueMatches(parseInt(leagueId, 10));
      if (result.ok) {
        setMatches(result.data);
      }
      setLoading(false);
    };
    fetchMatches();
  }, [leagueId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-gray-500 text-lg font-medium text-center">
          No hay partidos programados para esta liga aún
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-xl w-full mx-auto space-y-4">
        {matches.map((match) => {
          const refereeName = match.firstReferee
            ? (match.firstReferee as any).fullName || `Colegiado #${match.firstReferee.participantId}`
            : undefined;

          return (
            <Pressable
              key={match.matchId}
              onPress={() =>
                router.push({
                  pathname: '/matches/[matchId]' as any,
                  params: { matchId: match.matchId },
                })
              }
              className="active:opacity-90"
            >
              <MatchCard
                localTeam={{
                  name: match.localTeam?.name || 'Por definir',
                  iconImageUrl: match.localTeam?.iconImageUrl,
                }}
                visitorTeam={{
                  name: match.visitorTeam?.name || 'Por decidir',
                  iconImageUrl: match.visitorTeam?.iconImageUrl,
                }}
                dateTime={match.dateTime}
                refereeAssigned={refereeName}
                resultResumee={
                  match.resultSummary
                    ? {
                        localTotalScore: match.resultSummary.localTotalScore,
                        visitorTotalScore: match.resultSummary.visitorTotalScore,
                      }
                    : undefined
                }
              />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}