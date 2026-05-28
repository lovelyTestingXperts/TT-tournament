import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  GET_USER,
  GET_USERS,
} from './queries';
import { CREATE_USER, UPDATE_USER } from './mutation';


export function useUsers(input: any) {
  return useQuery(GET_USERS, {
    variables: { input },
  });
}

export function useUser(id: string) {
  return useQuery(GET_USER, {
    variables: { id },
    skip: !id,
  });
}

export function useCreateUser() {
  return useMutation(CREATE_USER, {
    refetchQueries: ['Users'],
  });
}

export function useUpdateUser() {
  return useMutation(UPDATE_USER);
}