import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      fullName
      email
      role
      isActive
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      fullName
      email
      phoneNumber
      avatar
      bio
      role
      isActive
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export const RESTORE_USER = gql`
  mutation RestoreUser($id: String!) {
    restoreUser(id: $id)
  }
`;