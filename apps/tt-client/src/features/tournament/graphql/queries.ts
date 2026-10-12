import { gql } from '@apollo/client';

export const GET_TOURNAMENTS = gql`
  query Tournaments($input: TournamentsInput) {
    tournaments(input: $input) {
      items {
        id
        name
        description
        category
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
        matches
        status
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
  query Tournament($id: String!) {
    tournament(id: $id) {
      id
      name
      description
      category
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
      matches
      status
      createdAt
      updatedAt
    }
  }
`;
