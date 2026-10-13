import { gql } from '@apollo/client';

export const MATCH_FIELDS_FRAGMENT = gql`
  fragment MatchFields on MatchEntity {
    id
    tournamentId
    tournamentName
    round
    roundName
    matchNumber
    playerAId
    playerAName
    playerBId
    playerBName
    teamAId
    teamAName
    teamBId
    teamBName
    scoreA
    scoreB
    scoreDetails
    wave
    winnerId
    winnerName
    status
    isFinal
    isBye
    scheduledAt
    completedAt
  }
`;

export const GET_TOURNAMENTS = gql`
  ${MATCH_FIELDS_FRAGMENT}
  query Tournaments($input: TournamentsInput) {
    tournaments(input: $input) {
      items {
        id
        name
        description
        category
        sport
        competitionType
        scoringFormat
        minTeamSize
        maxTeamSize
        isRegistrationClosed
        currentWave
        type
        format
        visibility
        bannerImage
        maxPlayers
        prizePool
        startDate
        endDate
        registrationDeadline
        createdBy
        participants
        participantDetails {
          id
          fullName
          email
          role
        }
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
        status
        winnerId
        winnerName
        createdAt
        updatedAt
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

export const GET_TOURNAMENT = gql`
  ${MATCH_FIELDS_FRAGMENT}
  query Tournament($id: String!) {
    tournament(id: $id) {
      id
      name
      description
      category
      sport
      competitionType
      scoringFormat
      minTeamSize
      maxTeamSize
      isRegistrationClosed
      currentWave
      type
      format
      visibility
      bannerImage
      maxPlayers
      prizePool
      startDate
      endDate
      registrationDeadline
      createdBy
      participants
      participantDetails {
        id
        fullName
        email
        role
      }
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
      status
      winnerId
      winnerName
      createdAt
      updatedAt
    }
  }
`;

export const GET_MATCHES = gql`
  ${MATCH_FIELDS_FRAGMENT}
  query Matches($filter: MatchesFilterInput) {
    matches(filter: $filter) {
      ...MatchFields
    }
  }
`;
