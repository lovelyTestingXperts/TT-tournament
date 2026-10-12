import { useMutation, useQuery } from '@apollo/client/react';

import { GET_TOURNAMENT, GET_TOURNAMENTS } from './queries';
import {
  CREATE_TOURNAMENT,
  UPDATE_TOURNAMENT,
  DELETE_TOURNAMENT,
  REGISTER_TOURNAMENT,
} from './mutations';

export function useTournaments(input?: any) {
  return useQuery(GET_TOURNAMENTS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
}

export function useTournament(id: string) {
  return useQuery(GET_TOURNAMENT, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
}

export function useCreateTournament() {
  return useMutation(CREATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useUpdateTournament() {
  return useMutation(UPDATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useDeleteTournament() {
  return useMutation(DELETE_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}

export function useRegisterTournament() {
  return useMutation(REGISTER_TOURNAMENT, {
    refetchQueries: [{ query: GET_TOURNAMENTS }],
  });
}
