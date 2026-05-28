import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation Register(
    $input: RegisterInput!
  ) {
    register(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $input: UpdateUserInput!
  ) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;