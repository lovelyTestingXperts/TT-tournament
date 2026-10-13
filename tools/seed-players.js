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
  // Table Tennis Stars
  { firstName: 'Sharath', lastName: 'Kamal', email: 'sharath.kamal@sports.org', bio: '10-time National TT Champion & Olympian' },
  { firstName: 'Manika', lastName: 'Batra', email: 'manika.batra@sports.org', bio: 'Commonwealth Games Gold Medalist TT Specialist' },
  { firstName: 'Sathiyan', lastName: 'Gnanasekaran', email: 'sathiyan.g@sports.org', bio: 'ITTF World Ranked Indian TT Player' },
  { firstName: 'Sreeja', lastName: 'Akula', email: 'sreeja.akula@sports.org', bio: 'National Women TT Champion' },
  { firstName: 'Harmeet', lastName: 'Desai', email: 'harmeet.desai@sports.org', bio: 'International Table Tennis Player' },
  { firstName: 'Ayhika', lastName: 'Mukherjee', email: 'ayhika.mukherjee@sports.org', bio: 'Asian Games Table Tennis Medalist' },
  { firstName: 'Manav', lastName: 'Thakkar', email: 'manav.thakkar@sports.org', bio: 'Former World Junior No. 1 TT Player' },
  { firstName: 'Diya', lastName: 'Chitale', email: 'diya.chitale@sports.org', bio: 'National Table Tennis Youth Champion' },

  // Cricket Stars
  { firstName: 'Virat', lastName: 'Kohli', email: 'virat.kohli@sports.org', bio: 'Modern Cricket Legend & Top Order Batsman' },
  { firstName: 'Rohit', lastName: 'Sharma', email: 'rohit.sharma@sports.org', bio: 'Indian Captain & World Cup Finalist' },
  { firstName: 'Jasprit', lastName: 'Bumrah', email: 'jasprit.bumrah@sports.org', bio: 'Pace Bowler & Yorker Specialist' },
  { firstName: 'Hardik', lastName: 'Pandya', email: 'hardik.pandya@sports.org', bio: 'All-Rounder & Dynamic Match Finisher' },
  { firstName: 'Shubman', lastName: 'Gill', email: 'shubman.gill@sports.org', bio: 'Opening Batsman & Future Cricket Star' },
  { firstName: 'Rishabh', lastName: 'Pant', email: 'rishabh.pant@sports.org', bio: 'Wicket-Keeper & Explosive Left-Handed Batsman' },
  { firstName: 'Ravindra', lastName: 'Jadeja', email: 'ravindra.jadeja@sports.org', bio: 'World-Class All-Rounder & Agile Fielder' },
  { firstName: 'Surya', lastName: 'Yadav', email: 'surya.yadav@sports.org', bio: 'T20 360-degree Specialist Batsman' },

  // Badminton Stars
  { firstName: 'PV', lastName: 'Sindhu', email: 'pv.sindhu@sports.org', bio: 'Double Olympic Medalist Badminton Ace' },
  { firstName: 'Lakshya', lastName: 'Sen', email: 'lakshya.sen@sports.org', bio: 'Commonwealth Games Gold Medalist Shuttler' },
  { firstName: 'Kidambi', lastName: 'Srikanth', email: 'kidambi.srikanth@sports.org', bio: 'Former World No. 1 Badminton Champion' },
  { firstName: 'Satwiksairaj', lastName: 'Rankireddy', email: 'satwik.ranki@sports.org', bio: 'World No. 1 Men Doubles Specialist' },
  { firstName: 'Chirag', lastName: 'Shetty', email: 'chirag.shetty@sports.org', bio: 'World No. 1 Men Doubles Badminton Ace' },
  { firstName: 'HS', lastName: 'Prannoy', email: 'hs.prannoy@sports.org', bio: 'BWF World Championships Bronze Medalist' },

  // Chess Grandmasters
  { firstName: 'Viswanathan', lastName: 'Anand', email: 'vishy.anand@sports.org', bio: '5-Time Undisputed World Chess Champion' },
  { firstName: 'Praggnanandhaa', lastName: 'Rameshbabu', email: 'pragg.r@sports.org', bio: 'Chess Grandmaster & FIDE World Cup Finalist' },
  { firstName: 'Gukesh', lastName: 'Dommaraju', email: 'gukesh.d@sports.org', bio: 'Youngest Candidates Tournament Winner in History' },
  { firstName: 'Vidit', lastName: 'Gujrathi', email: 'vidit.gujrathi@sports.org', bio: 'Grandmaster & FIDE Grand Swiss Winner' },
  { firstName: 'Arjun', lastName: 'Erigaisi', email: 'arjun.erigaisi@sports.org', bio: 'Super-Grandmaster 2800+ Live Rating Contender' },
  { firstName: 'Harika', lastName: 'Dronavalli', email: 'harika.d@sports.org', bio: 'Grandmaster & 3-time World Championship Medalist' },

  // Carrom Specialists
  { firstName: 'Rashmi', lastName: 'Kumari', email: 'rashmi.kumari@sports.org', bio: 'Triple World Carrom Champion' },
  { firstName: 'Prashant', lastName: 'More', email: 'prashant.more@sports.org', bio: 'World Carrom Champion & National Titleholder' },
];

async function seedPlayers() {
  const mongoUri = getMongoUri();
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB database.');

  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');

  const defaultPassword = 'User@123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  let insertedCount = 0;
  let updatedCount = 0;

  console.log(`Processing ${PLAYERS_ROSTER.length} players into the platform...\n`);

  for (let i = 0; i < PLAYERS_ROSTER.length; i++) {
    const player = PLAYERS_ROSTER[i];
    const fullName = `${player.firstName} ${player.lastName}`.trim();
    const employeeId = `EMP-${2000 + i + 1}`;
    const phone = `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`;

    const existing = await usersCollection.findOne({ email: player.email.toLowerCase() });

    if (!existing) {
      await usersCollection.insertOne({
        firstName: player.firstName,
        lastName: player.lastName,
        fullName: fullName,
        email: player.email.toLowerCase(),
        password: hashedPassword,
        phoneNumber: phone,
        role: 'PLAYER',
        roles: ['PLAYER'],
        bio: player.bio,
        employeeId: employeeId,
        isActive: true,
        isEmailVerified: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedCount++;
      console.log(`✓ [INSERTED] ${fullName} (${player.email}) - ${player.bio}`);
    } else {
      await usersCollection.updateOne(
        { _id: existing._id },
        {
          $set: {
            fullName: fullName,
            password: hashedPassword,
            role: 'PLAYER',
            isActive: true,
            isDeleted: false,
            isEmailVerified: true,
            bio: player.bio,
            updatedAt: new Date(),
          },
        }
      );
      updatedCount++;
      console.log(`✓ [UPDATED]  ${fullName} (${player.email}) [Active & Ready]`);
    }
  }

  console.log('\n======================================================');
  console.log(`🎉 Seeding Complete!`);
  console.log(`Total Players Added:   ${insertedCount}`);
  console.log(`Total Players Updated: ${updatedCount}`);
  console.log(`Total Active Roster:   ${PLAYERS_ROSTER.length} Players`);
  console.log(`Default Password for all: "${defaultPassword}"`);
  console.log('======================================================');

  await mongoose.disconnect();
}

seedPlayers()
  .catch((err) => {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  });
