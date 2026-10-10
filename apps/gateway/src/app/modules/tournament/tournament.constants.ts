export const TOURNAMENT_ERRORS = {
  NOT_FOUND: 'Tournament not found.',
  UNAUTHORIZED:
    'You do not have permission to modify this tournament.',
  INVALID_DATE_RANGE:
    'Tournament startDate must be after registrationDeadline.',
  DUPLICATE_PARTICIPATION:
    'User is already registered for this tournament.',
};

export const DEFAULT_TOURNAMENT_PAGINATION = {
  page: 1,
  limit: 20,
};
