import { gql } from '@apollo/client';
import { MATCH_FIELDS_FRAGMENT } from './queries';

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
  ${MATCH_FIELDS_FRAGMENT}
  mutation RegisterTournament($id: String!, $participantId: String) {
    registerTournament(id: $id, participantId: $participantId) {
      id
      name
      status
      participants
      participantDetails {
        id
        fullName
        email
        role
      }
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const SEED_TOURNAMENT_PLAYERS = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation SeedTournamentPlayers($id: String!, $playerCount: Int) {
    seedTournamentPlayers(id: $id, playerCount: $playerCount) {
      id
      name
      status
      maxPlayers
      participants
      participantDetails {
        id
        fullName
        email
        role
      }
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const GENERATE_TOURNAMENT_MATCHES = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation GenerateTournamentMatches($id: String!) {
    generateTournamentMatches(id: $id) {
      id
      name
      status
      participants
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const CREATE_CUSTOM_MATCH = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation CreateCustomMatch($input: CreateCustomMatchInput!) {
    createCustomMatch(input: $input) {
      id
      name
      status
      participants
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const RECORD_MATCH_RESULT = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation RecordMatchResult($input: RecordMatchResultInput!) {
    recordMatchResult(input: $input) {
      id
      name
      status
      participants
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const RESET_AND_SEED_DATABASE = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation ResetAndSeedDatabase {
    resetAndSeedDatabase {
      id
      name
      status
      maxPlayers
      participants
      participantDetails {
        id
        fullName
        email
        role
      }
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const CLOSE_REGISTRATION = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation CloseRegistration($id: String!) {
    closeRegistration(id: $id) {
      id
      name
      status
      isRegistrationClosed
      participants
      matches
      matchDetails {
        ...MatchFields
      }
    }
  }
`;

export const DRAW_WAVE_FIXTURES = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation DrawWaveFixtures($id: String!) {
    drawWaveFixtures(id: $id) {
      id
      name
      status
      currentWave
      isRegistrationClosed
      participants
      matches
      matchDetails {
        ...MatchFields
      }
      winnerId
      winnerName
    }
  }
`;

export const REGISTER_TEAM = gql`
  ${MATCH_FIELDS_FRAGMENT}
  mutation RegisterTeam($id: String!, $input: RegisterTeamInput!) {
    registerTeam(id: $id, input: $input) {
      id
      name
      status
      isRegistrationClosed
      participants
      teams {
        id
        name
        captainId
        captainName
        members {
          userId
          fullName
          email
          roleInTeam
        }
      }
      matches
      matchDetails {
        ...MatchFields
      }
    }
  }
`;
