import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function LeagueTabLayout() {
  const [hasTeam] = useState(false);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0060a8',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Información',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="classification"
        options={{
          title: 'Clasificación',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="matches"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="football-outline" size={24} color={color} />
          ),
        }}
      />

      {/* PESTAÑA CONDICIONAL 1: Todos los equipos (Solo si NO tienes equipo) */}
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Equipos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
          href: hasTeam ? null : undefined,
        }}
      />

      {/* PESTAÑA CONDICIONAL 2: Mi Equipo (Solo si SÍ tienes equipo) */}
      <Tabs.Screen
        name="my-team"
        options={{
          title: 'Mi Equipo',
          tabBarIcon: ({ color }) => (
            <Ionicons name="shirt-outline" size={24} color={color} />
          ),
          href: hasTeam ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="phases"
        options={{
          title: 'Fases',
          tabBarIcon: ({ color }) => (
            <Ionicons name="git-network-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="new-team"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="phases/[phaseId]/phase"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
