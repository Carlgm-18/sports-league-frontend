import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getLeaderboard } from '@/services/LeagueService';
import { LeaderboardResponse } from '@/types/api';

export default function ClassificationTab() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassification = async () => {
      if (!leagueId) return;
      const result = await getLeaderboard(parseInt(leagueId, 10));
      if (result.ok) {
        setLeaderboard(result.data);
      }
      setLoading(false);
    };
    fetchClassification();
  }, [leagueId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0060a8" />
      </View>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-gray-500 text-lg font-medium text-center">
          No hay clasificaciones disponibles para esta liga aún
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className="max-w-3xl w-full mx-auto space-y-6">
        {leaderboard.map((group) => (
          <View key={group.groupId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="bg-[#e6eff7] px-4 py-3 border-b border-gray-200">
              <Text className="text-base font-bold text-[#0060a8]">{group.groupName}</Text>
            </View>

            <View className="p-4">
              {/* Table Header */}
              <View className="flex-row border-b border-gray-200 pb-2 mb-2">
                <Text className="w-10 text-gray-500 font-semibold text-center text-xs">#</Text>
                <Text className="flex-1 text-gray-500 font-semibold text-left text-xs">Equipo</Text>
                <Text className="w-12 text-gray-500 font-semibold text-center text-xs">PJ</Text>
                <Text className="w-12 text-gray-500 font-semibold text-center text-xs">G</Text>
                <Text className="w-12 text-gray-500 font-semibold text-center text-xs">E</Text>
                <Text className="w-12 text-gray-500 font-semibold text-center text-xs">P</Text>
                <Text className="w-14 text-[#0060a8] font-bold text-center text-xs">PTS</Text>
              </View>

              {/* Table Rows */}
              {group.standings && group.standings.length > 0 ? (
                group.standings.map((row) => (
                  <View key={row.team.teamId} className="flex-row items-center py-3 border-b border-gray-50 last:border-b-0">
                    <Text className="w-10 text-gray-600 font-medium text-center text-sm">{row.position}</Text>
                    <View className="flex-1 flex-row items-center">
                      <View 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: row.team.primaryColor.slice(0, 7) || '#007AFF' }} 
                      />
                      <Text className="text-gray-900 font-semibold text-sm" numberOfLines={1}>
                        {row.team.name}
                      </Text>
                    </View>
                    <Text className="w-12 text-gray-600 text-center text-sm">{row.playedMatches}</Text>
                    <Text className="w-12 text-gray-600 text-center text-sm">{row.wonMatches ?? 0}</Text>
                    <Text className="w-12 text-gray-600 text-center text-sm">{row.drawnMatches ?? 0}</Text>
                    <Text className="w-12 text-gray-600 text-center text-sm">{row.lostMatches ?? 0}</Text>
                    <Text className="w-14 text-[#0060a8] font-extrabold text-center text-sm">{row.points ?? 0}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-gray-400 italic text-center py-4">
                  No hay equipos inscritos en este grupo
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
