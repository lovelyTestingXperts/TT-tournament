import { useMutation, useQuery } from '@apollo/client/react';

import { GET_USER, GET_USERS } from './queries';
import {
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  RESTORE_USER,
} from './mutation';

export function useUsers(input?: any) {
  return useQuery<any>(GET_USERS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
}

export function useUser(id: string) {
  return useQuery<any>(GET_USER, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });
}

export function useCreateUser() {
  return useMutation<any>(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
}

export function useUpdateUser() {
  return useMutation<any>(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
}

export function useDeleteUser() {
  return useMutation<any>(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
}

export function useRestoreUser() {
  return useMutation<any>(RESTORE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
}