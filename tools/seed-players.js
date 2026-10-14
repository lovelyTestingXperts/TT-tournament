const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Resolve Mongo URI from .env
function getMongoUri() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/MONGO_URI=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return process.env.MONGO_URI || 'mongodb+srv://loly:ZJqlB0M53fnwVHyY@avercare.hgfk9wr.mongodb.net/tt';
}

const PLAYERS_ROSTER = [
  // --- Table Tennis Stars (8) ---
  { firstName: 'Sharath', lastName: 'Kamal', email: 'sharath.kamal@sports.org', sport: 'Table Tennis', bio: '10-time National TT Champion & Olympian' },
  { firstName: 'Manika', lastName: 'Batra', email: 'manika.batra@sports.org', sport: 'Table Tennis', bio: 'Commonwealth Games Gold Medalist TT Specialist' },
  { firstName: 'Sathiyan', lastName: 'Gnanasekaran', email: 'sathiyan.g@sports.org', sport: 'Table Tennis', bio: 'ITTF World Ranked Indian TT Player' },
  { firstName: 'Sreeja', lastName: 'Akula', email: 'sreeja.akula@sports.org', sport: 'Table Tennis', bio: 'National Women TT Champion' },
  { firstName: 'Harmeet', lastName: 'Desai', email: 'harmeet.desai@sports.org', sport: 'Table Tennis', bio: 'International Table Tennis Player' },
  { firstName: 'Ayhika', lastName: 'Mukherjee', email: 'ayhika.mukherjee@sports.org', sport: 'Table Tennis', bio: 'Asian Games Table Tennis Medalist' },
  { firstName: 'Manav', lastName: 'Thakkar', email: 'manav.thakkar@sports.org', sport: 'Table Tennis', bio: 'Former World Junior No. 1 TT Player' },
  { firstName: 'Diya', lastName: 'Chitale', email: 'diya.chitale@sports.org', sport: 'Table Tennis', bio: 'National Table Tennis Youth Champion' },

  // --- Cricket Stars (10) ---
  { firstName: 'Virat', lastName: 'Kohli', email: 'virat.kohli@sports.org', sport: 'Cricket', bio: 'Modern Cricket Legend & Top Order Batsman' },
  { firstName: 'Rohit', lastName: 'Sharma', email: 'rohit.sharma@sports.org', sport: 'Cricket', bio: 'Indian Captain & World Cup Finalist' },
  { firstName: 'Jasprit', lastName: 'Bumrah', email: 'jasprit.bumrah@sports.org', sport: 'Cricket', bio: 'Pace Bowler & Yorker Specialist' },
  { firstName: 'Hardik', lastName: 'Pandya', email: 'hardik.pandya@sports.org', sport: 'Cricket', bio: 'All-Rounder & Dynamic Match Finisher' },
  { firstName: 'Shubman', lastName: 'Gill', email: 'shubman.gill@sports.org', sport: 'Cricket', bio: 'Opening Batsman & Future Cricket Star' },
  { firstName: 'Rishabh', lastName: 'Pant', email: 'rishabh.pant@sports.org', sport: 'Cricket', bio: 'Wicket-Keeper & Explosive Left-Handed Batsman' },
  { firstName: 'Ravindra', lastName: 'Jadeja', email: 'ravindra.jadeja@sports.org', sport: 'Cricket', bio: 'World-Class All-Rounder & Agile Fielder' },
  { firstName: 'Surya', lastName: 'Yadav', email: 'surya.yadav@sports.org', sport: 'Cricket', bio: 'T20 360-degree Specialist Batsman' },
  { firstName: 'KL', lastName: 'Rahul', email: 'kl.rahul@sports.org', sport: 'Cricket', bio: 'Classy Top-Order Batsman & Keeper' },
  { firstName: 'Mohammed', lastName: 'Shami', email: 'mohammed.shami@sports.org', sport: 'Cricket', bio: 'Premier Seam Bowler & Wicket-Taker' },

  // --- Badminton Stars (8) ---
  { firstName: 'PV', lastName: 'Sindhu', email: 'pv.sindhu@sports.org', sport: 'Badminton', bio: 'Double Olympic Medalist Badminton Ace' },
  { firstName: 'Lakshya', lastName: 'Sen', email: 'lakshya.sen@sports.org', sport: 'Badminton', bio: 'Commonwealth Games Gold Medalist Shuttler' },
  { firstName: 'Kidambi', lastName: 'Srikanth', email: 'kidambi.srikanth@sports.org', sport: 'Badminton', bio: 'Former World No. 1 Badminton Champion' },
  { firstName: 'Satwiksairaj', lastName: 'Rankireddy', email: 'satwik.ranki@sports.org', sport: 'Badminton', bio: 'World No. 1 Men Doubles Specialist' },
  { firstName: 'Chirag', lastName: 'Shetty', email: 'chirag.shetty@sports.org', sport: 'Badminton', bio: 'World No. 1 Men Doubles Badminton Ace' },
  { firstName: 'HS', lastName: 'Prannoy', email: 'hs.prannoy@sports.org', sport: 'Badminton', bio: 'BWF World Championships Bronze Medalist' },
  { firstName: 'Saina', lastName: 'Nehwal', email: 'saina.nehwal@sports.org', sport: 'Badminton', bio: 'Olympic Medalist & Former World No. 1' },
  { firstName: 'Treesa', lastName: 'Jolly', email: 'treesa.jolly@sports.org', sport: 'Badminton', bio: 'All England Semifinalist Doubles Specialist' },

  // --- Chess Grandmasters (6) ---
  { firstName: 'Viswanathan', lastName: 'Anand', email: 'vishy.anand@sports.org', sport: 'Chess', bio: '5-Time Undisputed World Chess Champion' },
  { firstName: 'Praggnanandhaa', lastName: 'Rameshbabu', email: 'pragg.r@sports.org', sport: 'Chess', bio: 'Chess Grandmaster & FIDE World Cup Finalist' },
  { firstName: 'Gukesh', lastName: 'Dommaraju', email: 'gukesh.d@sports.org', sport: 'Chess', bio: 'Youngest Candidates Tournament Winner in History' },
  { firstName: 'Vidit', lastName: 'Gujrathi', email: 'vidit.gujrathi@sports.org', sport: 'Chess', bio: 'Grandmaster & FIDE Grand Swiss Winner' },
  { firstName: 'Arjun', lastName: 'Erigaisi', email: 'arjun.erigaisi@sports.org', sport: 'Chess', bio: 'Super-Grandmaster 2800+ Live Rating Contender' },
  { firstName: 'Harika', lastName: 'Dronavalli', email: 'harika.d@sports.org', sport: 'Chess', bio: 'Grandmaster & 3-time World Championship Medalist' },

  // --- Carrom Specialists (4) ---
  { firstName: 'Rashmi', lastName: 'Kumari', email: 'rashmi.kumari@sports.org', sport: 'Carrom', bio: 'Triple World Carrom Champion' },
  { firstName: 'Prashant', lastName: 'More', email: 'prashant.more@sports.org', sport: 'Carrom', bio: 'World Carrom Champion & National Titleholder' },
  { firstName: 'Radhakrishnan', lastName: 'K.', email: 'radhakrishnan.k@sports.org', sport: 'Carrom', bio: 'National Carrom Federation Gold Medalist' },
  { firstName: 'Kajal', lastName: 'Kumari', email: 'kajal.kumari@sports.org', sport: 'Carrom', bio: 'International Carrom Federation Champion' },
];

const ADMINS_ROSTER = [
  { firstName: 'Admin', lastName: 'Organizer', email: 'admin@ttportal.com', role: 'admin', bio: 'Tournament Platform Head Administrator' },
  { firstName: 'Lovely', lastName: 'Kumar', email: 'lovely.kumar@testingxperts.com', role: 'admin', bio: 'TX Lead Quality Architect & Admin' },
];

async function seedDatabase() {
  const mongoUri = getMongoUri();
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB database.\n');

  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  const tournamentsCollection = db.collection('tournaments');
  const matchesCollection = db.collection('matches');

  // 1. Delete previous matches and tournaments
  console.log('🗑️  Deleting previous tournaments and matches...');
  const deletedMatches = await matchesCollection.deleteMany({});
  const deletedTournaments = await tournamentsCollection.deleteMany({});
  console.log(`   - Deleted matches:      ${deletedMatches.deletedCount}`);
  console.log(`   - Deleted tournaments:  ${deletedTournaments.deletedCount}\n`);

  // 2. Uniform password for all test accounts
  const COMMON_PASSWORD = 'User@123';
  const hashedPassword = await bcrypt.hash(COMMON_PASSWORD, 10);

  console.log(`👥 Seeding users into database (All with password: "${COMMON_PASSWORD}"):\n`);

  // Seed Admins
  for (const adm of ADMINS_ROSTER) {
    const fullName = `${adm.firstName} ${adm.lastName}`.trim();
    await usersCollection.updateOne(
      { email: adm.email.toLowerCase() },
      {
        $set: {
          firstName: adm.firstName,
          lastName: adm.lastName,
          fullName: fullName,
          email: adm.email.toLowerCase(),
          password: hashedPassword,
          role: 'admin',
          roles: ['admin'],
          bio: adm.bio,
          isActive: true,
          isEmailVerified: true,
          isDeleted: false,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`👑 [ADMIN]  ${fullName} (${adm.email}) -> Role: admin | Password: ${COMMON_PASSWORD}`);
  }

  // Seed Players
  let playerCount = 0;
  for (let i = 0; i < PLAYERS_ROSTER.length; i++) {
    const player = PLAYERS_ROSTER[i];
    const fullName = `${player.firstName} ${player.lastName}`.trim();
    const employeeId = `EMP-${2000 + i + 1}`;
    const phone = `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`;

    await usersCollection.updateOne(
      { email: player.email.toLowerCase() },
      {
        $set: {
          firstName: player.firstName,
          lastName: player.lastName,
          fullName: fullName,
          email: player.email.toLowerCase(),
          password: hashedPassword,
          phoneNumber: phone,
          role: 'player',
          roles: ['player'],
          bio: player.bio,
          employeeId: employeeId,
          isActive: true,
          isEmailVerified: true,
          isDeleted: false,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    playerCount++;
    console.log(`🏃 [PLAYER ${playerCount.toString().padStart(2, '0')}] ${fullName.padEnd(26)} (${player.email.padEnd(30)}) [${player.sport}]`);
  }

  // Also sanitize any other existing users in the db so role is lowercase
  await usersCollection.updateMany(
    { role: 'PLAYER' },
    { $set: { role: 'player', roles: ['player'] } }
  );
  await usersCollection.updateMany(
    { role: 'ADMIN' },
    { $set: { role: 'admin', roles: ['admin'] } }
  );

  const totalUsersInDb = await usersCollection.countDocuments({ isDeleted: false });
  const remainingTournaments = await tournamentsCollection.countDocuments({});
  const remainingMatches = await matchesCollection.countDocuments({});

  console.log('\n======================================================');
  console.log('🎉 Database Reset & Seed Completed Successfully!');
  console.log(`- Tournaments in DB:   ${remainingTournaments} (Fresh clean slate)`);
  console.log(`- Matches in DB:       ${remainingMatches} (Fresh clean slate)`);
  console.log(`- Total Users in DB:   ${totalUsersInDb} (Active & ready for manual testing)`);
  console.log(`- Seeded Players:      ${playerCount}`);
  console.log(`- Seeded Admins:       ${ADMINS_ROSTER.length}`);
  console.log(`- Uniform Password:    "${COMMON_PASSWORD}" (for all accounts)`);
  console.log('======================================================');

  await mongoose.disconnect();
}

seedDatabase()
  .catch((err) => {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  });
