import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        firstName
        lastName
        fullName
        email
        employeeId
        phoneNumber
        role
        roles
        isActive
        avatar
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      firstName
      lastName
      fullName
      email
      role
      roles
      isActive
      createdAt
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      fullName
      email
      employeeId
      phoneNumber
      role
      roles
      isActive
      avatar
      bio
    }
  }
`;
