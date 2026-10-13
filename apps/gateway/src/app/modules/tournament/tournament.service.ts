import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  Tournament,
  TournamentDocument,
} from './schemas/tournament.schema';
import { Match, MatchDocument, MatchStatus } from './schemas/match.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import {
  CreateCustomMatchInput,
  MatchesFilterInput,
  RecordMatchResultInput,
  RegisterTeamInput,
} from './dto/match.input';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentEntity } from './entity/tournament.entity';
import { MatchEntity, ParticipantDetailEntity } from './entity/match.entity';
import { TOURNAMENT_ERRORS } from './tournament.constants';
import { TournamentSortField } from './enums/tournament-sort-field.enum';
import { TournamentSortOrder } from './enums/tournament-sort-order.enum';
import { TournamentStatus } from './enums/tournament-status.enum';
import { TournamentFormat } from './enums/tournament-format.enum';
import { TournamentType } from './enums/tournament-type.enum';
import { TournamentVisibility } from './enums/tournament-visibility.enum';
import { UserRole } from '../../shared/enums/user-role.enum';

const DUMMY_ROSTER = [
  { firstName: 'Ma', lastName: 'Long', email: 'ma.long@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Fan', lastName: 'Zhendong', email: 'fan.zhendong@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Timo', lastName: 'Boll', email: 'timo.boll@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Tomokazu', lastName: 'Harimoto', email: 'tomokazu.harimoto@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Hugo', lastName: 'Calderano', email: 'hugo.calderano@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Felix', lastName: 'Lebrun', email: 'felix.lebrun@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Truls', lastName: 'Moregard', email: 'truls.moregard@ttportal.com', role: UserRole.PLAYER },
  { firstName: 'Lin', lastName: 'YunJu', email: 'lin.yunju@ttportal.com', role: UserRole.PLAYER },
];

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private getRoundLabel(matchCountInRound: number, roundNumber: number): string {
    if (matchCountInRound === 1) return 'Grand Final';
    if (matchCountInRound === 2) return 'Semifinals';
    if (matchCountInRound === 4) return 'Quarterfinals';
    return `Round ${roundNumber}`;
  }

  async createTournament(
    createTournamentInput: CreateTournamentInput,
    creatorId?: string,
  ): Promise<TournamentEntity> {
    try {
      const start = new Date(createTournamentInput.startDate);
      const deadline = new Date(createTournamentInput.registrationDeadline);
      const end = new Date(createTournamentInput.endDate);

      if (start <= deadline) {
        throw new BadRequestException(
          'Start date must be strictly after the registration deadline',
        );
      }

      if (end < start) {
        throw new BadRequestException(
          'End date cannot be prior to start date',
        );
      }

      const createdBy = creatorId
        ? new Types.ObjectId(creatorId)
        : new Types.ObjectId('000000000000000000000000');

      const tournament = await this.tournamentModel.create({
        ...createTournamentInput,
        startDate: start,
        endDate: end,
        registrationDeadline: deadline,
        createdBy,
        status: TournamentStatus.DRAFT,
        participants: [],
        matches: [],
        winnerId: null,
        winnerName: null,
        isDeleted: false,
      });

      return this.hydrateTournamentEntity(tournament);
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create tournament',
      );
    }
  }

  async findAllTournaments(
    input: TournamentsInput,
  ): Promise<PaginatedTournamentsEntity> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        type,
        visibility,
        sortBy = TournamentSortField.CREATED_AT,
        sortOrder = TournamentSortOrder.DESC,
      } = input;

      const skip = (page - 1) * limit;

      const filter: Record<string, any> = {
        isDeleted: false,
      };

      if (status) {
        filter.status = status;
      }

      if (type) {
        filter.type = type;
      }

      if (visibility) {
        filter.visibility = visibility;
      }

      if (search?.trim()) {
        const trimmedSearch = search.trim();
        filter.$or = [
          { name: { $regex: trimmedSearch, $options: 'i' } },
          { description: { $regex: trimmedSearch, $options: 'i' } },
          { category: { $regex: trimmedSearch, $options: 'i' } },
        ];
      }

      const [tournaments, total] = await Promise.all([
        this.tournamentModel
          .find(filter)
          .sort({
            [sortBy]: sortOrder === TournamentSortOrder.ASC ? 1 : -1,
          })
          .skip(skip)
          .limit(limit)
          .exec(),

        this.tournamentModel.countDocuments(filter).exec(),
      ]);

      const hydratedItems = await Promise.all(
        tournaments.map((t) => this.hydrateTournamentEntity(t)),
      );

      return {
        items: hydratedItems,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to query tournaments',
      );
    }
  }

  async findTournamentById(id: string): Promise<TournamentEntity> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      const tournament = await this.tournamentModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .exec();

      if (!tournament) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      return this.hydrateTournamentEntity(tournament);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch tournament',
      );
    }
  }

  async updateTournament(
    id: string,
    input: UpdateTournamentInput,
    currentUserId?: string,
  ): Promise<TournamentEntity> {
    try {
      const tournament = await this.tournamentModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .exec();

      if (!tournament) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      const updatePayload: Record<string, any> = { ...input };

      if (input.startDate) {
        updatePayload.startDate = new Date(input.startDate);
      }
      if (input.endDate) {
        updatePayload.endDate = new Date(input.endDate);
      }
      if (input.registrationDeadline) {
        updatePayload.registrationDeadline = new Date(
          input.registrationDeadline,
        );
      }

      const updated = await this.tournamentModel
        .findByIdAndUpdate(id, updatePayload, { returnDocument: 'after' })
        .exec();

      if (!updated) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      return this.hydrateTournamentEntity(updated);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update tournament',
      );
    }
  }

  async deleteTournament(
    id: string,
    currentUserId?: string,
  ): Promise<boolean> {
    try {
      const tournament = await this.tournamentModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .exec();

      if (!tournament) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      await this.tournamentModel
        .findByIdAndUpdate(id, {
          isDeleted: true,
          deletedAt: new Date(),
        })
        .exec();

      await this.matchModel.deleteMany({ tournamentId: tournament._id }).exec();

      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete tournament',
      );
    }
  }

  async registerForTournament(
    id: string,
    participantId: string,
  ): Promise<TournamentEntity> {
    try {
      const tournament = await this.tournamentModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .exec();

      if (!tournament) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      if (tournament.isRegistrationClosed) {
        throw new BadRequestException(
          'Registration window is closed for this tournament',
        );
      }

      if (tournament.competitionType === 'TEAM') {
        throw new BadRequestException(
          'This tournament requires team registration',
        );
      }

      if (
        tournament.status === TournamentStatus.COMPLETED ||
        tournament.status === TournamentStatus.CANCELLED
      ) {
        throw new BadRequestException(
          'Cannot register for a completed or cancelled tournament',
        );
      }

      if (tournament.matches && tournament.matches.length > 0) {
        throw new BadRequestException(
          'Registration is closed because bracket matches have already started',
        );
      }

      if (
        tournament.maxPlayers &&
        tournament.participants.length >= tournament.maxPlayers
      ) {
        throw new BadRequestException(
          'Tournament has reached its maximum player capacity',
        );
      }

      const userObjectId = new Types.ObjectId(participantId);

      const alreadyRegistered = tournament.participants.some((p) =>
        p.equals(userObjectId),
      );

      const inExistingTeam = (tournament.teams || []).some((team) =>
        team.members.some((m) => m.userId.equals(userObjectId)),
      );

      if (alreadyRegistered || inExistingTeam) {
        throw new BadRequestException(
          TOURNAMENT_ERRORS.DUPLICATE_PARTICIPATION,
        );
      }

      tournament.participants.push(userObjectId);
      await tournament.save();

      // Automatically generate randomly paired matches if all player slots are now full!
      if (
        tournament.maxPlayers &&
        tournament.maxPlayers >= 2 &&
        tournament.participants.length === tournament.maxPlayers &&
        tournament.matches.length === 0
      ) {
        tournament.isRegistrationClosed = true;
        await this.generateBracketMatchesInternal(tournament);
      }

      return this.hydrateTournamentEntity(tournament);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to register for tournament',
      );
    }
  }

  async closeRegistration(id: string): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    tournament.isRegistrationClosed = true;
    await tournament.save();
    return this.hydrateTournamentEntity(tournament);
  }

  async registerTeam(
    id: string,
    input: RegisterTeamInput,
  ): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: id, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    if (tournament.isRegistrationClosed) {
      throw new BadRequestException(
        'Registration window is closed for this tournament',
      );
    }

    if (
      tournament.status === TournamentStatus.COMPLETED ||
      tournament.status === TournamentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot register for a completed or cancelled tournament',
      );
    }

    if (tournament.matches && tournament.matches.length > 0) {
      throw new BadRequestException(
        'Registration is closed because bracket matches have already started',
      );
    }

    const maxTeams = tournament.maxPlayers || 8;
    if (tournament.teams && tournament.teams.length >= maxTeams) {
      throw new BadRequestException('Tournament has reached maximum team capacity');
    }

    const minSize = tournament.minTeamSize || 2;
    const maxSize = tournament.maxTeamSize || 20;

    if (!input.members || input.members.length < minSize) {
      throw new BadRequestException(
        `Team must have at least ${minSize} members to register`,
      );
    }

    if (input.members.length > maxSize) {
      throw new BadRequestException(
        `Team cannot have more than ${maxSize} members`,
      );
    }

    // Validate Captain is among members
    const captainMember = input.members.find(
      (m) => m.userId === input.captainId,
    );
    if (!captainMember) {
      throw new BadRequestException(
        'Captain must be one of the registered team members',
      );
    }

    // Validate unique members in input itself
    const memberIdSet = new Set<string>();
    for (const m of input.members) {
      if (memberIdSet.has(m.userId)) {
        throw new BadRequestException(
          'Duplicate player detected in team roster',
        );
      }
      memberIdSet.add(m.userId);
    }

    // Validate that NONE of the members are already registered in another team in this tournament
    for (const existingTeam of tournament.teams || []) {
      for (const existingMember of existingTeam.members) {
        if (memberIdSet.has(existingMember.userId.toString())) {
          throw new BadRequestException(
            `Player ${existingMember.fullName} is already registered in another team ("${existingTeam.name}") for this tournament`,
          );
        }
      }
    }

    // Fetch user details for all members
    const userObjectIds = input.members.map((m) => new Types.ObjectId(m.userId));
    const users = await this.userModel.find({ _id: { $in: userObjectIds } }).exec();
    const userMap = new Map<string, UserDocument>();
    users.forEach((u) => userMap.set(u._id.toString(), u));

    const captainUser = userMap.get(input.captainId);
    const captainName = captainUser
      ? captainUser.fullName || `${captainUser.firstName} ${captainUser.lastName}`
      : 'Team Captain';

    const teamMembers = input.members.map((m) => {
      const u = userMap.get(m.userId);
      return {
        userId: new Types.ObjectId(m.userId),
        fullName: u
          ? u.fullName || `${u.firstName} ${u.lastName}`
          : `Player ${m.userId.slice(-4)}`,
        email: u ? u.email : 'player@ttportal.com',
        roleInTeam:
          m.userId === input.captainId ? 'CAPTAIN' : m.roleInTeam || 'PLAYER',
      };
    });

    const newTeam = {
      _id: new Types.ObjectId(),
      name: input.name.trim(),
      captainId: new Types.ObjectId(input.captainId),
      captainName,
      members: teamMembers,
    };

    if (!tournament.teams) {
      tournament.teams = [];
    }
    tournament.teams.push(newTeam as any);

    // Also register member IDs into tournament.participants
    for (const m of teamMembers) {
      if (!tournament.participants.some((p) => p.equals(m.userId))) {
        tournament.participants.push(m.userId);
      }
    }

    if (tournament.teams.length >= maxTeams) {
      tournament.isRegistrationClosed = true;
    }

    await tournament.save();
    return this.hydrateTournamentEntity(tournament);
  }

  /**
   * Ensures enough dummy players exist, registers them into the tournament,
   * and automatically generates randomly paired Round 1 matches.
   */
  async seedTournamentPlayersAndMatches(
    tournamentId: string,
    desiredPlayerCount?: number,
  ): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: tournamentId, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    if (tournament.status === TournamentStatus.COMPLETED) {
      throw new BadRequestException('Tournament is already completed');
    }

    const targetCount = Math.max(
      2,
      desiredPlayerCount || tournament.maxPlayers || 4,
    );

    // Ensure dummy players exist in User collection
    const passwordHash = await bcrypt.hash('Password@123', 10);
    for (const p of DUMMY_ROSTER) {
      const existing = await this.userModel.findOne({ email: p.email }).exec();
      if (!existing) {
        await this.userModel.create({
          firstName: p.firstName,
          lastName: p.lastName,
          fullName: `${p.firstName} ${p.lastName}`,
          email: p.email,
          password: passwordHash,
          role: p.role,
          roles: [p.role],
          isActive: true,
          isDeleted: false,
        });
      } else if (existing.isDeleted || !existing.isActive) {
        existing.isDeleted = false;
        existing.isActive = true;
        await existing.save();
      }
    }

    // Fetch all active non-deleted users
    const availableUsers = await this.userModel
      .find({ isDeleted: false, isActive: true })
      .exec();

    // Add users not yet in tournament.participants up to targetCount
    for (const u of availableUsers) {
      if (tournament.participants.length >= targetCount) break;
      const alreadyIn = tournament.participants.some((p) => p.equals(u._id));
      if (!alreadyIn) {
        tournament.participants.push(u._id);
      }
    }

    // If still below targetCount, create additional dynamic players
    let extraIdx = 1;
    while (tournament.participants.length < targetCount) {
      const extraEmail = `pro.player.${Date.now()}.${extraIdx}@ttportal.com`;
      const newPlayer = await this.userModel.create({
        firstName: `Player`,
        lastName: `Seed${extraIdx}`,
        fullName: `Player Seed${extraIdx}`,
        email: extraEmail,
        password: passwordHash,
        role: UserRole.PLAYER,
        roles: [UserRole.PLAYER],
        isActive: true,
        isDeleted: false,
      });
      tournament.participants.push(newPlayer._id);
      extraIdx++;
    }

    if (!tournament.maxPlayers || tournament.maxPlayers < targetCount) {
      tournament.maxPlayers = targetCount;
    }

    await tournament.save();

    // If matches haven't been generated yet, generate them now!
    if (tournament.matches.length === 0) {
      await this.generateBracketMatchesInternal(tournament);
    }

    return this.hydrateTournamentEntity(tournament);
  }

  /**
   * Manually triggers random bracket generation for currently registered players
   */
  async generateTournamentMatches(
    tournamentId: string,
  ): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: tournamentId, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    const isRegClosed =
      tournament.isRegistrationClosed ||
      (tournament.registrationDeadline &&
        new Date() >= new Date(tournament.registrationDeadline)) ||
      (tournament.maxPlayers &&
        (tournament.competitionType === 'TEAM'
          ? (tournament.teams?.length || 0) >= tournament.maxPlayers
          : tournament.participants.length >= tournament.maxPlayers));

    if (!isRegClosed) {
      throw new BadRequestException(
        'Registration window is still open. Admin cannot draw fixtures until registration is closed or all player/team slots are filled.',
      );
    }

    tournament.isRegistrationClosed = true;

    if (tournament.matches && tournament.matches.length > 0) {
      throw new BadRequestException(
        'Bracket matches have already been generated for this tournament',
      );
    }

    if (tournament.competitionType === 'TEAM') {
      if (!tournament.teams || tournament.teams.length < 2) {
        throw new BadRequestException(
          'At least 2 registered teams are required to generate matches',
        );
      }
      await this.generateTeamWave1Matches(tournament);
    } else {
      if (tournament.participants.length < 2) {
        throw new BadRequestException(
          'At least 2 registered players are required to generate matches',
        );
      }
      await this.generateBracketMatchesInternal(tournament);
    }

    tournament.status = TournamentStatus.ACTIVE;
    await tournament.save();
    return this.hydrateTournamentEntity(tournament);
  }

  /**
   * Wave-by-wave fixture drawer: draws Wave 1 fixtures once registration closes,
   * and subsequently draws next wave fixtures (Quarterfinals, Semifinals, Finals)
   * after all matches in the current wave are completed.
   */
  async drawWaveFixtures(tournamentId: string): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: tournamentId, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    // Guard: Registration must be closed or slots full
    const isRegClosed =
      tournament.isRegistrationClosed ||
      (tournament.registrationDeadline &&
        new Date() >= new Date(tournament.registrationDeadline)) ||
      (tournament.maxPlayers &&
        (tournament.competitionType === 'TEAM'
          ? (tournament.teams?.length || 0) >= tournament.maxPlayers
          : tournament.participants.length >= tournament.maxPlayers));

    if (!isRegClosed) {
      throw new BadRequestException(
        'Registration window is still open. Admin cannot draw fixtures until registration is closed or all player/team slots are filled.',
      );
    }

    tournament.isRegistrationClosed = true;

    // Wave 1: Initial draw
    if (!tournament.matches || tournament.matches.length === 0) {
      if (tournament.competitionType === 'TEAM') {
        if (!tournament.teams || tournament.teams.length < 2) {
          throw new BadRequestException(
            'At least 2 registered teams are required to draw Wave 1 fixtures',
          );
        }
        await this.generateTeamWave1Matches(tournament);
      } else {
        if (!tournament.participants || tournament.participants.length < 2) {
          throw new BadRequestException(
            'At least 2 registered players are required to draw Wave 1 fixtures',
          );
        }
        await this.generateBracketMatchesInternal(tournament);
      }
      tournament.currentWave = 1;
      tournament.status = TournamentStatus.ACTIVE;
      await tournament.save();
      return this.hydrateTournamentEntity(tournament);
    }

    // Wave 2+: Advance to next round wave
    const currentWave = tournament.currentWave || 1;
    const currentWaveMatches = await this.matchModel
      .find({ tournamentId: tournament._id, wave: currentWave })
      .exec();

    if (currentWaveMatches.length === 0) {
      throw new BadRequestException('No matches found for the current wave');
    }

    const uncompleted = currentWaveMatches.some(
      (m) => m.status !== MatchStatus.COMPLETED,
    );
    if (uncompleted) {
      throw new BadRequestException(
        `Cannot draw next wave until all matches in Wave ${currentWave} are completed`,
      );
    }

    // Gather winners from current wave
    const winners: Array<{
      id?: Types.ObjectId | null;
      name: string;
      teamId?: string | null;
      teamName?: string | null;
    }> = [];

    for (const m of currentWaveMatches) {
      if (m.winnerName) {
        winners.push({
          id: m.winnerId,
          name: m.winnerName,
          teamId:
            m.teamAId && m.winnerName === m.teamAName
              ? m.teamAId
              : m.teamBId && m.winnerName === m.teamBName
              ? m.teamBId
              : null,
          teamName: m.winnerName,
        });
      }
    }

    if (winners.length <= 1) {
      if (winners.length === 1) {
        tournament.winnerId = winners[0].id || null;
        tournament.winnerName = winners[0].name;
        tournament.status = TournamentStatus.COMPLETED;
        await tournament.save();
      }
      return this.hydrateTournamentEntity(tournament);
    }

    // Draw next wave fixtures between winners
    const nextWave = currentWave + 1;
    const roundLabel =
      winners.length === 2
        ? 'Grand Final'
        : winners.length <= 4
        ? 'Semifinals'
        : winners.length <= 8
        ? 'Quarterfinals'
        : `Wave ${nextWave}`;

    // Shuffle advancing winners for random draw
    for (let i = winners.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [winners[i], winners[j]] = [winners[j], winners[i]];
    }

    const newMatches: Types.ObjectId[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      const oppA = winners[i];
      const oppB = winners[i + 1];

      if (oppB) {
        const matchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: nextWave,
          roundName: roundLabel,
          matchNumber: Math.floor(i / 2) + 1,
          playerAId: oppA.id || null,
          playerAName: oppA.name,
          teamAId: oppA.teamId || null,
          teamAName: oppA.teamName || null,
          playerBId: oppB.id || null,
          playerBName: oppB.name,
          teamBId: oppB.teamId || null,
          teamBName: oppB.teamName || null,
          scoreA: 0,
          scoreB: 0,
          status: MatchStatus.SCHEDULED,
          wave: nextWave,
          isFinal: winners.length === 2,
          isBye: false,
          scheduledAt: new Date(Date.now() + nextWave * 3600000),
        });
        newMatches.push(matchDoc._id);
      } else {
        // Bye: automatically advances
        const matchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: nextWave,
          roundName: roundLabel,
          matchNumber: Math.floor(i / 2) + 1,
          playerAId: oppA.id || null,
          playerAName: oppA.name,
          teamAId: oppA.teamId || null,
          teamAName: oppA.teamName || null,
          playerBId: null,
          playerBName: 'BYE',
          scoreA: 1,
          scoreB: 0,
          winnerId: oppA.id || null,
          winnerName: oppA.name,
          status: MatchStatus.COMPLETED,
          wave: nextWave,
          isFinal: false,
          isBye: true,
          scheduledAt: new Date(),
          completedAt: new Date(),
        });
        newMatches.push(matchDoc._id);
      }
    }

    tournament.matches.push(...newMatches);
    tournament.currentWave = nextWave;
    await tournament.save();
    return this.hydrateTournamentEntity(tournament);
  }

  private async generateTeamWave1Matches(
    tournament: TournamentDocument,
  ): Promise<void> {
    const teamPool = [...(tournament.teams || [])];
    for (let i = teamPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teamPool[i], teamPool[j]] = [teamPool[j], teamPool[i]];
    }

    const numTeams = teamPool.length;
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numTeams)));
    const round1MatchCount = nextPowerOfTwo / 2;
    const numByes = nextPowerOfTwo - numTeams;
    const numRealMatches = round1MatchCount - numByes;
    const round1Name = this.getRoundLabel(round1MatchCount, 1);

    let cursor = 0;
    const createdMatches: Types.ObjectId[] = [];

    for (let m = 1; m <= round1MatchCount; m++) {
      if (m <= numRealMatches) {
        const tA = teamPool[cursor++];
        const tB = teamPool[cursor++];
        const matchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: 1,
          roundName: round1Name,
          matchNumber: m,
          playerAId: tA.captainId,
          playerAName: tA.name,
          teamAId: tA._id.toString(),
          teamAName: tA.name,
          playerBId: tB.captainId,
          playerBName: tB.name,
          teamBId: tB._id.toString(),
          teamBName: tB.name,
          scoreA: 0,
          scoreB: 0,
          status: MatchStatus.SCHEDULED,
          wave: 1,
          isFinal: round1MatchCount === 1,
          isBye: false,
          scheduledAt: new Date(tournament.startDate.getTime() + m * 3600000),
        });
        createdMatches.push(matchDoc._id);
      } else {
        const tA = teamPool[cursor++];
        const matchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: 1,
          roundName: round1Name,
          matchNumber: m,
          playerAId: tA.captainId,
          playerAName: tA.name,
          teamAId: tA._id.toString(),
          teamAName: tA.name,
          playerBId: null,
          playerBName: 'BYE',
          scoreA: 1,
          scoreB: 0,
          winnerId: tA.captainId,
          winnerName: tA.name,
          status: MatchStatus.COMPLETED,
          wave: 1,
          isFinal: false,
          isBye: true,
          scheduledAt: tournament.startDate,
          completedAt: new Date(),
        });
        createdMatches.push(matchDoc._id);
      }
    }

    tournament.matches = createdMatches;
    tournament.currentWave = 1;
  }

  /**
   * Core Random Draw & Bracket Generator (supports any player count >= 2, including odd counts via BYEs)
   */
  private async generateBracketMatchesInternal(
    tournament: TournamentDocument,
  ): Promise<void> {
    const users = await this.userModel
      .find({ _id: { $in: tournament.participants } })
      .exec();

    const userMap = new Map<string, string>();
    users.forEach((u) => {
      userMap.set(
        u._id.toString(),
        u.fullName || `${u.firstName} ${u.lastName}`,
      );
    });

    const playerPool = tournament.participants.map((id) => ({
      id,
      name: userMap.get(id.toString()) || `Player ${id.toString().slice(-4)}`,
    }));

    // Fisher-Yates random shuffle for fair, random match draw
    for (let i = playerPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerPool[i], playerPool[j]] = [playerPool[j], playerPool[i]];
    }

    const numPlayers = playerPool.length;
    const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
    const round1MatchCount = nextPowerOfTwo / 2;
    const numByes = nextPowerOfTwo - numPlayers;
    const numRealMatches = round1MatchCount - numByes;
    const round1Name = this.getRoundLabel(round1MatchCount, 1);

    let cursor = 0;
    const createdMatches: MatchDocument[] = [];

    for (let m = 1; m <= round1MatchCount; m++) {
      if (m <= numRealMatches) {
        const pA = playerPool[cursor++];
        const pB = playerPool[cursor++];
        const matchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: 1,
          roundName: round1Name,
          matchNumber: m,
          playerAId: pA.id,
          playerAName: pA.name,
          playerBId: pB.id,
          playerBName: pB.name,
          scoreA: 0,
          scoreB: 0,
          winnerId: null,
          winnerName: null,
          status: MatchStatus.SCHEDULED,
          isFinal: round1MatchCount === 1,
          isBye: false,
          scheduledAt: new Date(),
        });
        createdMatches.push(matchDoc);
      } else {
        // Odd / non-power-of-2 player gets a BYE in Round 1 and automatically advances to Round 2
        const pA = playerPool[cursor++];
        const byeMatchDoc = await this.matchModel.create({
          tournamentId: tournament._id,
          tournamentName: tournament.name,
          round: 1,
          roundName: round1Name,
          matchNumber: m,
          playerAId: pA.id,
          playerAName: pA.name,
          playerBId: null,
          playerBName: 'BYE (Auto-Advance)',
          scoreA: 1,
          scoreB: 0,
          winnerId: pA.id,
          winnerName: pA.name,
          status: MatchStatus.COMPLETED,
          isFinal: false,
          isBye: true,
          scheduledAt: new Date(),
          completedAt: new Date(),
        });
        createdMatches.push(byeMatchDoc);
      }
    }

    tournament.matches = createdMatches.map((m) => m._id);
    tournament.status = TournamentStatus.ACTIVE;
    await tournament.save();

    // Advance any BYE winners immediately into Round 2
    for (const m of createdMatches) {
      if (m.isBye && m.winnerId) {
        await this.advanceWinnerToNextRound(
          tournament,
          m,
          round1MatchCount,
        );
      }
    }
  }

  /**
   * Manually adds a custom match (either between specified players or randomly chosen participants)
   */
  async createCustomMatch(
    input: CreateCustomMatchInput,
  ): Promise<TournamentEntity> {
    const tournament = await this.tournamentModel
      .findOne({ _id: input.tournamentId, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    if (tournament.status === TournamentStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot add matches to a completed tournament that already has a winner',
      );
    }

    if (tournament.participants.length < 2) {
      throw new BadRequestException(
        'At least 2 players must be registered in the tournament before adding a match',
      );
    }

    const users = await this.userModel
      .find({ _id: { $in: tournament.participants } })
      .exec();

    const userMap = new Map<string, string>();
    users.forEach((u) => {
      userMap.set(
        u._id.toString(),
        u.fullName || `${u.firstName} ${u.lastName}`,
      );
    });

    let pAId: Types.ObjectId;
    let pBId: Types.ObjectId;

    if (input.playerAId && input.playerBId) {
      if (input.playerAId === input.playerBId) {
        throw new BadRequestException(
          'A player cannot be matched against themselves',
        );
      }
      pAId = new Types.ObjectId(input.playerAId);
      pBId = new Types.ObjectId(input.playerBId);
    } else {
      // Pick 2 random distinct participants
      const pool = [...tournament.participants];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      pAId = pool[0];
      pBId = pool[1];
    }

    const existingMatches = await this.matchModel
      .find({ tournamentId: tournament._id })
      .sort({ round: 1, matchNumber: 1 })
      .exec();

    const targetRound = 1;
    const round1Matches = existingMatches.filter((m) => m.round === 1);
    const nextMatchNum = round1Matches.length + 1;

    // If an earlier match was marked isFinal because there was only 1 match, unmark isFinal since we now have multiple matches in Round 1
    if (round1Matches.length === 1 && round1Matches[0].isFinal) {
      round1Matches[0].isFinal = false;
      round1Matches[0].roundName = 'Round 1';
      await round1Matches[0].save();
    }

    const newMatch = await this.matchModel.create({
      tournamentId: tournament._id,
      tournamentName: tournament.name,
      round: targetRound,
      roundName: input.roundName || (round1Matches.length === 0 ? 'Grand Final' : 'Round 1'),
      matchNumber: nextMatchNum,
      playerAId: pAId,
      playerAName: userMap.get(pAId.toString()) || `Player ${pAId.toString().slice(-4)}`,
      playerBId: pBId,
      playerBName: userMap.get(pBId.toString()) || `Player ${pBId.toString().slice(-4)}`,
      scoreA: 0,
      scoreB: 0,
      winnerId: null,
      winnerName: null,
      status: MatchStatus.SCHEDULED,
      isFinal: round1Matches.length === 0,
      isBye: false,
      scheduledAt: new Date(),
    });

    tournament.matches.push(newMatch._id);
    if (tournament.status === TournamentStatus.DRAFT || tournament.status === TournamentStatus.UPCOMING) {
      tournament.status = TournamentStatus.ACTIVE;
    }
    await tournament.save();

    return this.hydrateTournamentEntity(tournament);
  }

  /**
   * Records the result of a match, determines the winner, and automatically registers/updates
   * the next round match until the final tournament champion is crowned.
   */
  async recordMatchResult(
    input: RecordMatchResultInput,
  ): Promise<TournamentEntity> {
    const { matchId, scoreA, scoreB } = input;

    if (!Types.ObjectId.isValid(matchId)) {
      throw new NotFoundException('Invalid match ID');
    }

    const match = await this.matchModel.findById(matchId).exec();
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const tournament = await this.tournamentModel
      .findOne({ _id: match.tournamentId, isDeleted: false })
      .exec();

    if (!tournament) {
      throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
    }

    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException(
        'Match result has already been recorded and finalized',
      );
    }

    if (
      !match.playerAId ||
      !match.playerBId ||
      match.playerAName === 'TBD' ||
      match.playerBName === 'TBD'
    ) {
      throw new BadRequestException(
        'Cannot record result until both opponents have advanced to this match',
      );
    }

    if (scoreA < 0 || scoreB < 0) {
      throw new BadRequestException('Match scores cannot be negative');
    }

    if (scoreA === scoreB && !input.winnerId) {
      throw new BadRequestException(
        'Match cannot end in a tie without an explicit winner. Please enter a decisive score or select a winner.',
      );
    }

    let isPlayerAWinner: boolean;
    if (input.winnerId) {
      isPlayerAWinner =
        input.winnerId === match.playerAId?.toString() ||
        input.winnerId === match.teamAId ||
        input.winnerId === match.playerAName;
    } else {
      isPlayerAWinner = scoreA > scoreB;
    }

    match.scoreA = scoreA;
    match.scoreB = scoreB;
    if (input.scoreDetails) {
      match.scoreDetails = input.scoreDetails;
    }
    match.winnerId = isPlayerAWinner ? match.playerAId : match.playerBId;
    match.winnerName = isPlayerAWinner
      ? match.teamAName || match.playerAName
      : match.teamBName || match.playerBName;
    match.status = MatchStatus.COMPLETED;
    match.completedAt = new Date();
    await match.save();

    // Determine how many matches exist in this round
    const currentRoundMatches = await this.matchModel
      .find({ tournamentId: tournament._id, round: match.round })
      .sort({ matchNumber: 1 })
      .exec();

    const round1Count = await this.matchModel
      .countDocuments({ tournamentId: tournament._id, round: 1 })
      .exec();

    const expectedInRound = Math.max(
      currentRoundMatches.length,
      Math.ceil(round1Count / Math.pow(2, match.round - 1)),
    );

    if (expectedInRound <= 1 || match.isFinal) {
      // This was the Championship Final match! Crown the tournament winner!
      tournament.winnerId = match.winnerId;
      tournament.winnerName = match.winnerName;
      tournament.status = TournamentStatus.COMPLETED;
      await tournament.save();
    } else {
      // Advance winner into next round match
      await this.advanceWinnerToNextRound(
        tournament,
        match,
        expectedInRound,
      );
    }

    return this.hydrateTournamentEntity(tournament);
  }

  private async advanceWinnerToNextRound(
    tournament: TournamentDocument,
    completedMatch: MatchDocument,
    expectedMatchesInCurrentRound: number,
  ): Promise<void> {
    const nextRound = completedMatch.round + 1;
    const nextMatchNumber = Math.ceil(completedMatch.matchNumber / 2);
    const isSlotA = completedMatch.matchNumber % 2 === 1;
    const expectedMatchesInNextRound = Math.ceil(
      expectedMatchesInCurrentRound / 2,
    );
    const nextRoundName = this.getRoundLabel(
      expectedMatchesInNextRound,
      nextRound,
    );
    const isNextFinal = expectedMatchesInNextRound === 1;

    const winnerTeamId =
      completedMatch.teamAName === completedMatch.winnerName
        ? completedMatch.teamAId
        : completedMatch.teamBName === completedMatch.winnerName
        ? completedMatch.teamBId
        : null;

    let nextMatch = await this.matchModel
      .findOne({
        tournamentId: tournament._id,
        round: nextRound,
        matchNumber: nextMatchNumber,
      })
      .exec();

    if (!nextMatch) {
      nextMatch = await this.matchModel.create({
        tournamentId: tournament._id,
        tournamentName: tournament.name,
        round: nextRound,
        roundName: nextRoundName,
        matchNumber: nextMatchNumber,
        playerAId: isSlotA ? completedMatch.winnerId : null,
        playerAName: isSlotA ? completedMatch.winnerName || 'TBD' : 'TBD',
        teamAId: isSlotA ? winnerTeamId : null,
        teamAName: isSlotA ? (winnerTeamId ? completedMatch.winnerName : null) : null,
        playerBId: !isSlotA ? completedMatch.winnerId : null,
        playerBName: !isSlotA ? completedMatch.winnerName || 'TBD' : 'TBD',
        teamBId: !isSlotA ? winnerTeamId : null,
        teamBName: !isSlotA ? (winnerTeamId ? completedMatch.winnerName : null) : null,
        scoreA: 0,
        scoreB: 0,
        wave: nextRound,
        winnerId: null,
        winnerName: null,
        status: MatchStatus.PENDING,
        isFinal: isNextFinal,
        isBye: false,
        scheduledAt: new Date(),
      });

      tournament.matches.push(nextMatch._id);
      await tournament.save();
    } else {
      if (isSlotA) {
        nextMatch.playerAId = completedMatch.winnerId;
        nextMatch.playerAName = completedMatch.winnerName || 'TBD';
        if (winnerTeamId) {
          nextMatch.teamAId = winnerTeamId;
          nextMatch.teamAName = completedMatch.winnerName || 'TBD';
        }
      } else {
        nextMatch.playerBId = completedMatch.winnerId;
        nextMatch.playerBName = completedMatch.winnerName || 'TBD';
        if (winnerTeamId) {
          nextMatch.teamBId = winnerTeamId;
          nextMatch.teamBName = completedMatch.winnerName || 'TBD';
        }
      }

      if (
        (nextMatch.playerAId || nextMatch.teamAId) &&
        (nextMatch.playerBId || nextMatch.teamBId) &&
        nextMatch.playerAName !== 'TBD' &&
        nextMatch.playerBName !== 'TBD'
      ) {
        nextMatch.status = MatchStatus.SCHEDULED;
      }

      nextMatch.isFinal = isNextFinal;
      nextMatch.roundName = nextRoundName;
      await nextMatch.save();
    }

    // Edge case: If current round had an odd number of matches (e.g., 3 matches) and all are now completed,
    // the last match in nextRound has no sibling match in currentRound, so auto-advance it via BYE!
    const currentRoundMatches = await this.matchModel
      .find({ tournamentId: tournament._id, round: completedMatch.round })
      .exec();

    const allCurrentRoundCompleted =
      currentRoundMatches.length === expectedMatchesInCurrentRound &&
      currentRoundMatches.every((m) => m.status === MatchStatus.COMPLETED);

    if (
      allCurrentRoundCompleted &&
      expectedMatchesInCurrentRound % 2 === 1 &&
      expectedMatchesInNextRound > 1
    ) {
      const oddNextMatch = await this.matchModel
        .findOne({
          tournamentId: tournament._id,
          round: nextRound,
          matchNumber: expectedMatchesInNextRound,
        })
        .exec();

      if (
        oddNextMatch &&
        oddNextMatch.status === MatchStatus.PENDING &&
        oddNextMatch.playerAId &&
        !oddNextMatch.playerBId
      ) {
        oddNextMatch.playerBName = 'BYE (Auto-Advance)';
        oddNextMatch.scoreA = 1;
        oddNextMatch.scoreB = 0;
        oddNextMatch.winnerId = oddNextMatch.playerAId;
        oddNextMatch.winnerName = oddNextMatch.playerAName;
        oddNextMatch.status = MatchStatus.COMPLETED;
        oddNextMatch.isBye = true;
        oddNextMatch.completedAt = new Date();
        await oddNextMatch.save();

        await this.advanceWinnerToNextRound(
          tournament,
          oddNextMatch,
          expectedMatchesInNextRound,
        );
      }
    }
  }

  /**
   * Global matches query accessible to all users across the platform
   */
  async findAllMatches(filter?: MatchesFilterInput): Promise<MatchEntity[]> {
    const query: Record<string, any> = {};

    if (filter?.tournamentId && Types.ObjectId.isValid(filter.tournamentId)) {
      query.tournamentId = new Types.ObjectId(filter.tournamentId);
    }

    if (filter?.status && filter.status !== 'ALL') {
      query.status = filter.status;
    }

    if (filter?.search?.trim()) {
      const s = filter.search.trim();
      query.$or = [
        { tournamentName: { $regex: s, $options: 'i' } },
        { playerAName: { $regex: s, $options: 'i' } },
        { playerBName: { $regex: s, $options: 'i' } },
        { roundName: { $regex: s, $options: 'i' } },
      ];
    }

    const matches = await this.matchModel
      .find(query)
      .sort({ createdAt: -1, round: 1, matchNumber: 1 })
      .limit(200)
      .exec();

    return matches.map((m) => this.mapMatchToEntity(m));
  }

  /**
   * Resets all tournaments, matches, and players and seeds fresh realistic data
   */
  async resetAndSeedFreshData(): Promise<TournamentEntity> {
    await this.matchModel.deleteMany({}).exec();
    await this.tournamentModel.deleteMany({}).exec();
    await this.userModel.deleteMany({}).exec();

    const passwordHash = await bcrypt.hash('Password@123', 10);

    // Create 1 Admin account + 8 World-Class Players
    const adminUser = await this.userModel.create({
      firstName: 'Admin',
      lastName: 'Organizer',
      fullName: 'Admin Organizer',
      email: 'admin@ttportal.com',
      phoneNumber: '+15550100',
      password: passwordHash,
      role: UserRole.ADMIN,
      roles: [UserRole.ADMIN],
      isActive: true,
      isDeleted: false,
    });

    const createdPlayers: UserDocument[] = [];
    for (const p of DUMMY_ROSTER) {
      const playerDoc = await this.userModel.create({
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        email: p.email,
        phoneNumber: '+15550199',
        password: passwordHash,
        role: p.role,
        roles: [p.role],
        isActive: true,
        isDeleted: false,
      });
      createdPlayers.push(playerDoc);
    }

    // Create a fresh flagship tournament with 4 joined players and auto-generated Round 1 matches
    const now = new Date();
    const deadline = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const start = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const flagshipTournament = await this.tournamentModel.create({
      name: 'WTT Champions Grand Smash 2026',
      description:
        'Official World Table Tennis knockout championship featuring randomly seeded top contenders competing from opening rounds to the Grand Final.',
      category: 'Table Tennis Pro',
      type: TournamentType.OFFLINE,
      format: TournamentFormat.SINGLE_ELIMINATION,
      visibility: TournamentVisibility.PUBLIC,
      maxPlayers: 4,
      prizePool: 25000,
      registrationDeadline: deadline,
      startDate: start,
      endDate: end,
      createdBy: adminUser._id,
      participants: createdPlayers.slice(0, 4).map((p) => p._id),
      matches: [],
      status: TournamentStatus.ACTIVE,
      winnerId: null,
      winnerName: null,
      isDeleted: false,
    });

    await this.generateBracketMatchesInternal(flagshipTournament);

    return this.hydrateTournamentEntity(flagshipTournament);
  }

  private mapMatchToEntity(doc: MatchDocument): MatchEntity {
    return {
      id: doc._id.toString(),
      tournamentId: doc.tournamentId.toString(),
      tournamentName: doc.tournamentName,
      round: doc.round,
      roundName: doc.roundName,
      matchNumber: doc.matchNumber,
      playerAId: doc.playerAId ? doc.playerAId.toString() : null,
      playerAName: doc.playerAName,
      playerBId: doc.playerBId ? doc.playerBId.toString() : null,
      playerBName: doc.playerBName,
      teamAId: doc.teamAId || null,
      teamAName: doc.teamAName || null,
      teamBId: doc.teamBId || null,
      teamBName: doc.teamBName || null,
      scoreA: doc.scoreA,
      scoreB: doc.scoreB,
      scoreDetails: doc.scoreDetails || null,
      winnerId: doc.winnerId ? doc.winnerId.toString() : null,
      winnerName: doc.winnerName || null,
      status: doc.status,
      wave: doc.wave || 1,
      isFinal: doc.isFinal,
      isBye: doc.isBye,
      scheduledAt: doc.scheduledAt || (doc as any).createdAt || new Date(),
      completedAt: doc.completedAt || null,
    };
  }

  private async hydrateTournamentEntity(
    doc: TournamentDocument,
  ): Promise<TournamentEntity> {
    const [users, matches] = await Promise.all([
      doc.participants && doc.participants.length > 0
        ? this.userModel.find({ _id: { $in: doc.participants } }).exec()
        : Promise.resolve([]),
      this.matchModel
        .find({ tournamentId: doc._id })
        .sort({ round: 1, matchNumber: 1 })
        .exec(),
    ]);

    const userLookup = new Map<string, UserDocument>();
    users.forEach((u) => userLookup.set(u._id.toString(), u));

    const participantDetails: ParticipantDetailEntity[] = (
      doc.participants || []
    ).map((pid) => {
      const u = userLookup.get(pid.toString());
      return {
        id: pid.toString(),
        fullName: u
          ? u.fullName || `${u.firstName} ${u.lastName}`
          : `Player ${pid.toString().slice(-6)}`,
        email: u ? u.email : 'player@ttportal.com',
        role: u ? u.role : 'PLAYER',
      };
    });

    const matchDetails: MatchEntity[] = matches.map((m) =>
      this.mapMatchToEntity(m),
    );

    const teams = (doc.teams || []).map((t) => ({
      id: t._id.toString(),
      name: t.name,
      captainId: t.captainId.toString(),
      captainName: t.captainName,
      members: (t.members || []).map((m) => ({
        userId: m.userId.toString(),
        fullName: m.fullName,
        email: m.email,
        roleInTeam: m.roleInTeam,
      })),
    }));

    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      category: doc.category,
      sport: doc.sport || null,
      competitionType: doc.competitionType || 'INDIVIDUAL',
      scoringFormat: doc.scoringFormat || null,
      minTeamSize: doc.minTeamSize || null,
      maxTeamSize: doc.maxTeamSize || null,
      teams,
      isRegistrationClosed: Boolean(doc.isRegistrationClosed),
      currentWave: doc.currentWave || 1,
      type: doc.type,
      format: doc.format,
      visibility: doc.visibility,
      bannerImage: doc.bannerImage,
      maxPlayers: doc.maxPlayers,
      prizePool: doc.prizePool,
      startDate: doc.startDate,
      endDate: doc.endDate,
      registrationDeadline: doc.registrationDeadline,
      createdBy: doc.createdBy?.toString() || '',
      participants: (doc.participants || []).map((p) => p.toString()),
      participantDetails,
      matches: matches.map((m) => m._id.toString()),
      matchDetails,
      status: doc.status,
      winnerId: doc.winnerId ? doc.winnerId.toString() : null,
      winnerName: doc.winnerName || null,
      createdAt: (doc as any).createdAt || new Date(),
      updatedAt: (doc as any).updatedAt || new Date(),
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
    };
  }
}
