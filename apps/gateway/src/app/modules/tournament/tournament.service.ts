import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Tournament,
  TournamentDocument,
} from './schemas/tournament.schema';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentEntity } from './entity/tournament.entity';
import { TOURNAMENT_ERRORS } from './tournament.constants';
import { TournamentSortField } from './enums/tournament-sort-field.enum';
import { TournamentSortOrder } from './enums/tournament-sort-order.enum';
import { TournamentStatus } from './enums/tournament-status.enum';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
  ) {}

  async createTournament(
    createTournamentInput: CreateTournamentInput,
    creatorId?: string,
  ): Promise<TournamentEntity> {
    try {
      // Validate dates
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
        isDeleted: false,
      });

      return this.mapToEntity(tournament);
    } catch (error) {
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

      return {
        items: tournaments.map((t) => this.mapToEntity(t)),
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
      const tournament = await this.tournamentModel
        .findOne({
          _id: id,
          isDeleted: false,
        })
        .exec();

      if (!tournament) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      return this.mapToEntity(tournament);
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
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .exec();

      if (!updated) {
        throw new NotFoundException(TOURNAMENT_ERRORS.NOT_FOUND);
      }

      return this.mapToEntity(updated);
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

      const userObjectId = new Types.ObjectId(participantId);

      const alreadyRegistered = tournament.participants.some((p) =>
        p.equals(userObjectId),
      );

      if (alreadyRegistered) {
        throw new BadRequestException(
          TOURNAMENT_ERRORS.DUPLICATE_PARTICIPATION,
        );
      }

      tournament.participants.push(userObjectId);
      await tournament.save();

      return this.mapToEntity(tournament);
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

  private mapToEntity(doc: TournamentDocument): TournamentEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      category: doc.category,
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
      matches: (doc.matches || []).map((m) => m.toString()),
      status: doc.status,
      createdAt: (doc as any).createdAt || new Date(),
      updatedAt: (doc as any).updatedAt || new Date(),
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
    };
  }
}
