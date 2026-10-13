export enum SportType {
  TABLE_TENNIS = 'TABLE_TENNIS',
  CRICKET = 'CRICKET',
  CARROM = 'CARROM',
  CHESS = 'CHESS',
  BADMINTON = 'BADMINTON',
}

export enum CompetitionType {
  INDIVIDUAL = 'INDIVIDUAL',
  TEAM = 'TEAM',
}

export enum ScoringFormat {
  SETS_TO_11 = 'SETS_TO_11', // TT: Best of 3/5 sets
  SETS_TO_21 = 'SETS_TO_21', // Badminton: Best of 3 sets
  LIMITED_OVERS = 'LIMITED_OVERS', // Cricket: Runs & Wickets
  POINTS_TO_25 = 'POINTS_TO_25', // Carrom: Points to 25
  GAME_POINTS = 'GAME_POINTS', // Chess: 1, 0.5, 0
}

export interface SportConfig {
  id: SportType;
  name: string;
  categoryLabel: string;
  icon: string;
  defaultCompetitionType: CompetitionType;
  allowedCompetitionTypes: CompetitionType[];
  defaultScoringFormat: ScoringFormat;
  defaultMaxPlayers: number;
  minTeamSize?: number;
  maxTeamSize?: number;
  defaultRules: string[];
}

export const SPORTS_PRESETS: Record<SportType, SportConfig> = {
  [SportType.TABLE_TENNIS]: {
    id: SportType.TABLE_TENNIS,
    name: 'Table Tennis',
    categoryLabel: 'Table Tennis',
    icon: '🏓',
    defaultCompetitionType: CompetitionType.INDIVIDUAL,
    allowedCompetitionTypes: [CompetitionType.INDIVIDUAL, CompetitionType.TEAM],
    defaultScoringFormat: ScoringFormat.SETS_TO_11,
    defaultMaxPlayers: 8,
    minTeamSize: 2,
    maxTeamSize: 2,
    defaultRules: [
      'Matches played as Best of 3 Sets (11 points per set, must win by 2).',
      'Service rotates every 2 points; alternate at deuce (10-10).',
      'Standard ITTF approved rubber bats and 40+ mm balls required.',
      '10-minute reporting grace period before match forfeiture.',
    ],
  },
  [SportType.CRICKET]: {
    id: SportType.CRICKET,
    name: 'Cricket',
    categoryLabel: 'Cricket',
    icon: '🏏',
    defaultCompetitionType: CompetitionType.TEAM,
    allowedCompetitionTypes: [CompetitionType.TEAM],
    defaultScoringFormat: ScoringFormat.LIMITED_OVERS,
    defaultMaxPlayers: 8, // 8 teams
    minTeamSize: 7,
    maxTeamSize: 11,
    defaultRules: [
      'Standard limited-overs rules (8 to 12 overs per innings as announced).',
      'Each team must nominate a captain before match draw.',
      'Players cannot appear in more than one team roster in this tournament.',
      'Umpire and official scorer decisions are final and binding.',
    ],
  },
  [SportType.CARROM]: {
    id: SportType.CARROM,
    name: 'Carrom',
    categoryLabel: 'Carrom',
    icon: '🎯',
    defaultCompetitionType: CompetitionType.INDIVIDUAL,
    allowedCompetitionTypes: [CompetitionType.INDIVIDUAL, CompetitionType.TEAM],
    defaultScoringFormat: ScoringFormat.POINTS_TO_25,
    defaultMaxPlayers: 8,
    minTeamSize: 2,
    maxTeamSize: 2,
    defaultRules: [
      'White pieces = 10 pts, Black pieces = 5 pts, Queen = 25 pts (must be covered).',
      'First player/pair to reach 25 points or highest points in 8 boards wins.',
      'Standard carrom powder and federation approved carrom boards used.',
      'Thumb or finger flick allowed according to tournament referee guidelines.',
    ],
  },
  [SportType.CHESS]: {
    id: SportType.CHESS,
    name: 'Chess',
    categoryLabel: 'Chess',
    icon: '♟️',
    defaultCompetitionType: CompetitionType.INDIVIDUAL,
    allowedCompetitionTypes: [CompetitionType.INDIVIDUAL],
    defaultScoringFormat: ScoringFormat.GAME_POINTS,
    defaultMaxPlayers: 8,
    minTeamSize: 1,
    maxTeamSize: 1,
    defaultRules: [
      'Standard FIDE Rapid rules (15 mins + 10s increment per move).',
      'Win awards 1.0 point, Draw awards 0.5 point, Loss awards 0 points.',
      'Strict touch-move rule is enforced during all matches.',
      'In case of draw in elimination, a 5-minute Blitz tiebreaker will be played.',
    ],
  },
  [SportType.BADMINTON]: {
    id: SportType.BADMINTON,
    name: 'Badminton',
    categoryLabel: 'Badminton',
    icon: '🏸',
    defaultCompetitionType: CompetitionType.INDIVIDUAL,
    allowedCompetitionTypes: [CompetitionType.INDIVIDUAL, CompetitionType.TEAM],
    defaultScoringFormat: ScoringFormat.SETS_TO_21,
    defaultMaxPlayers: 8,
    minTeamSize: 2,
    maxTeamSize: 2,
    defaultRules: [
      'Best of 3 sets to 21 points (rally point scoring system).',
      'At 20-20 deuce, side gaining 2-point lead wins; capped at 30 points.',
      'Players must report to the court 10 minutes prior to scheduled game time.',
      'Official feather shuttles provided for all tournament matches.',
    ],
  },
};
