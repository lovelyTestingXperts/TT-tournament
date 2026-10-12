export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export class DataFactory {
  /**
   * Generates a unique user registration payload with valid inputs.
   */
  static createValidUser(overrides: Partial<UserRegistrationData> = {}): UserRegistrationData {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      firstName: `Alex${randomSuffix}`,
      lastName: `Rider${randomSuffix}`,
      email: `player_${timestamp}_${randomSuffix}@example.com`,
      password: 'Password@123',
      confirmPassword: 'Password@123',
      phoneNumber: `+1555${randomSuffix}`,
      ...overrides,
    };
  }

  /**
   * Generates user payload with an invalid email.
   */
  static createUserWithInvalidEmail(): UserRegistrationData {
    return this.createValidUser({
      email: 'not-an-email-address',
    });
  }

  /**
   * Generates user payload with short password (< 6 characters).
   */
  static createUserWithShortPassword(): UserRegistrationData {
    return this.createValidUser({
      password: '123',
      confirmPassword: '123',
    });
  }

  /**
   * Generates user payload with mismatched passwords.
   */
  static createUserWithMismatchedPassword(): UserRegistrationData {
    return this.createValidUser({
      password: 'Password@123',
      confirmPassword: 'DifferentPassword@456',
    });
  }

  /**
   * Generates user payload with missing/short name fields.
   */
  static createUserWithShortName(): UserRegistrationData {
    return this.createValidUser({
      firstName: 'A', // min 2 characters
      lastName: '', // required
    });
  }

  /**
   * Generates member creation payload for Admin member creation form.
   */
  static createMemberPayload(overrides: Partial<any> = {}) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return {
      firstName: `Staff${randomSuffix}`,
      lastName: `Admin${randomSuffix}`,
      employeeId: `EMP-${randomSuffix}`,
      email: `staff_${timestamp}_${randomSuffix}@ttsports.com`,
      password: 'AdminPassword@123',
      phoneNumber: `+1555${randomSuffix}`,
      role: 'REFEREE' as const,
      bio: 'Certified table tennis official referee.',
      ...overrides,
    };
  }

  /**
   * Generates tournament payload for Create Tournament form.
   */
  static createTournamentPayload(overrides: Partial<any> = {}) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const now = new Date();
    const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const startDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      name: `Championship ${randomSuffix}`,
      category: 'Table Tennis',
      type: 'ONLINE' as const,
      format: 'SINGLE_ELIMINATION' as const,
      visibility: 'PUBLIC' as const,
      maxPlayers: 16,
      prizePool: 2500,
      registrationDeadline: deadline,
      startDate: startDate,
      endDate: endDate,
      description: `Official table tennis championship tournament ${randomSuffix}.`,
      ...overrides,
    };
  }

  /**
   * Generates tournament with startDate earlier than registrationDeadline (invalid).
   */
  static createInvalidTournamentDatesPayload() {
    const now = new Date();
    const deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const invalidStartDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.createTournamentPayload({
      name: `Invalid Date Tournament ${Date.now()}`,
      registrationDeadline: deadline,
      startDate: invalidStartDate,
      endDate: endDate,
    });
  }

  /**
   * Generates tournament with short name (< 3 chars).
   */
  static createInvalidTournamentShortNamePayload() {
    return this.createTournamentPayload({
      name: 'TT', // min 3 characters
    });
  }
}
