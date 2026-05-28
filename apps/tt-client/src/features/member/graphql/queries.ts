import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query Users($input: UsersInput) {
    users(input: $input) {
      items {
        id
        firstName
        lastName
        fullName
        email
        phoneNumber
        role
        isActive
        createdAt
      }

      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;

export const GET_USER = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      fullName
      email
      phoneNumber
      role
      avatar
      bio
      isActive
      createdAt
    }
  }
`;