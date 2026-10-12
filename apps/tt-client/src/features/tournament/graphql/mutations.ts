import { gql } from '@apollo/client';

export const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      id
      name
      description
      category
      type
      format
      visibility
      status
      maxPlayers
      prizePool
      startDate
      endDate
      registrationDeadline
      createdAt
    }
  }
`;

export const UPDATE_TOURNAMENT = gql`
  mutation UpdateTournament($id: String!, $input: UpdateTournamentInput!) {
    updateTournament(id: $id, input: $input) {
      id
      name
      description
      category
      type
      format
      visibility
      status
      maxPlayers
      prizePool
      startDate
      endDate
      registrationDeadline
      updatedAt
    }
  }
`;

export const DELETE_TOURNAMENT = gql`
  mutation DeleteTournament($id: String!) {
    deleteTournament(id: $id)
  }
`;

export const REGISTER_TOURNAMENT = gql`
  mutation RegisterTournament($id: String!, $participantId: String) {
    registerTournament(id: $id, participantId: $participantId) {
      id
      participants
      name
    }
  }
`;
