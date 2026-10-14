import { useMutation, useQuery } from '@apollo/client/react';

import {
  GET_MATCHES,
  GET_TOURNAMENT,
  GET_TOURNAMENTS,
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATION_COUNT,
} from './queries';
import {
  CREATE_TOURNAMENT,
  UPDATE_TOURNAMENT,
  DELETE_TOURNAMENT,
  REGISTER_TOURNAMENT,
  SEED_TOURNAMENT_PLAYERS,
  GENERATE_TOURNAMENT_MATCHES,
  CREATE_CUSTOM_MATCH,
  RECORD_MATCH_RESULT,
  RESET_AND_SEED_DATABASE,
  CLOSE_REGISTRATION,
  DRAW_WAVE_FIXTURES,
  REGISTER_TEAM,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  CLEAR_ALL_NOTIFICATIONS,
} from './mutations';

export function useTournaments(input?: any) {
  return useQuery<any>(GET_TOURNAMENTS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
}

export function useTournament(id: string) {
  return useQuery<any>(GET_TOURNAMENT, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
}

export function useMatches(filter?: any) {
  return useQuery<any>(GET_MATCHES, {
    variables: { filter },
    fetchPolicy: 'cache-and-network',
  });
}

export function useCreateTournament() {
  return useMutation<any>(CREATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useUpdateTournament() {
  return useMutation<any>(UPDATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useDeleteTournament() {
  return useMutation<any>(DELETE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useRegisterTournament() {
  return useMutation<any>(REGISTER_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useCloseRegistration() {
  return useMutation<any>(CLOSE_REGISTRATION, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useDrawWaveFixtures() {
  return useMutation<any>(DRAW_WAVE_FIXTURES, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useRegisterTeam() {
  return useMutation<any>(REGISTER_TEAM, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useSeedTournamentPlayers() {
  return useMutation<any>(SEED_TOURNAMENT_PLAYERS, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useGenerateTournamentMatches() {
  return useMutation<any>(GENERATE_TOURNAMENT_MATCHES, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useCreateCustomMatch() {
  return useMutation<any>(CREATE_CUSTOM_MATCH, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useRecordMatchResult() {
  return useMutation<any>(RECORD_MATCH_RESULT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useResetAndSeedDatabase() {
  return useMutation<any>(RESET_AND_SEED_DATABASE, {
    refetchQueries: [{ query: GET_TOURNAMENTS }, { query: GET_MATCHES }],
  });
}

export function useNotifications() {
  return useQuery<any>(GET_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery<any>(GET_UNREAD_NOTIFICATION_COUNT, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000,
  });
}

export function useMarkNotificationAsRead() {
  return useMutation<any>(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }, { query: GET_UNREAD_NOTIFICATION_COUNT }],
  });
}

export function useMarkAllNotificationsAsRead() {
  return useMutation<any>(MARK_ALL_NOTIFICATIONS_AS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }, { query: GET_UNREAD_NOTIFICATION_COUNT }],
  });
}

export function useClearAllNotifications() {
  return useMutation<any>(CLEAR_ALL_NOTIFICATIONS, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }, { query: GET_UNREAD_NOTIFICATION_COUNT }],
  });
}

