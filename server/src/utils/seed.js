require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const Exercise = require('../models/Exercise');
const { ROLES } = require('../config/constants');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack_pro';
  
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('[Seed] MongoDB Connected.');

    // 1. Seed or Verify Initial Admin Account
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@fittrack.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@FitTrack2026!';
    const adminName = process.env.INITIAL_ADMIN_NAME || 'System Administrator';
    const adminPhone = process.env.INITIAL_ADMIN_PHONE || '+923001234567';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: ROLES.ADMIN,
        isActive: true,
        mustChangePassword: false,
      });
      console.log(`[Seed] Initial Admin account created: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Sample Membership Plans (Editable via Admin Panel)
    const initialPlans = [
      {
        name: 'Basic',
        description: 'Ideal for beginners seeking standard gym access and general equipment usage.',
        price: 2000,
        durationMonths: 1,
        features: [
          'Full Gym Floor Access',
          'Standard Locker Room Access',
          'Free Water Station',
          'Cardio & Free Weights Zone',
          'Access during regular hours (6 AM - 10 PM)'
        ],
        isActive: true,
      },
      {
        name: 'Standard',
        description: 'Our most popular plan for regular gym-goers aiming for consistent fitness progress.',
        price: 5000,
        durationMonths: 3,
        features: [
          'Full 24/7 Gym Floor Access',
          'Free Fitness Assessment',
          'Locker & Sauna Access',
          '1 Complimentary Personal Trainer Consultation',
          'Access to Group Fitness Classes',
          'Progress Tracking Portal'
        ],
        isActive: true,
      },
      {
        name: 'Premium',
        description: 'The ultimate VIP annual package with dedicated trainer support and maximum savings.',
        price: 18000,
        durationMonths: 12,
        features: [
          'Full 24/7 VIP Access',
          'Dedicated Personal Trainer (Weekly Plan Reviews)',
          'Customized Workout & Nutrition Guidance',
          'Reserved Locker & Steam Bath Access',
          'Priority Guest Passes (2 per month)',
          'Discounts on Gym Supplements & Merchandise'
        ],
        isActive: true,
      },
    ];

    for (const planData of initialPlans) {
      const exists = await MembershipPlan.findOne({ name: planData.name });
      if (!exists) {
        await MembershipPlan.create(planData);
        console.log(`[Seed] Created membership plan: ${planData.name} - Rs. ${planData.price}`);
      }
    }

    // 3. Seed Sample Exercises
    const sampleExercises = [
      {
        name: 'Barbell Bench Press',
        category: 'chest',
        description: 'Compound upper-body press targeting pectorals, anterior deltoids, and triceps.',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        equipment: 'Barbell, Flat Bench',
        difficulty: 'intermediate',
      },
      {
        name: 'Incline Dumbbell Press',
        category: 'chest',
        description: 'Targets upper clavicular head of the chest and front delts.',
        targetMuscles: ['Upper Chest', 'Shoulders'],
        equipment: 'Dumbbells, Incline Bench',
        difficulty: 'intermediate',
      },
      {
        name: 'Barbell Back Squat',
        category: 'legs',
        description: 'The king of lower-body movements targeting quads, glutes, and hamstrings.',
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
        equipment: 'Barbell, Squat Rack',
        difficulty: 'intermediate',
      },
      {
        name: 'Conventional Deadlift',
        category: 'back',
        description: 'Full posterior chain compound lift developing back thickness and hip hinge power.',
        targetMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Hamstrings', 'Glutes'],
        equipment: 'Barbell, Bumper Plates',
        difficulty: 'advanced',
      },
      {
        name: 'Pull-Ups',
        category: 'back',
        description: 'Bodyweight vertical pulling exercise for back width and bicep strength.',
        targetMuscles: ['Lats', 'Rhomboids', 'Biceps'],
        equipment: 'Pull-Up Bar',
        difficulty: 'intermediate',
      },
      {
        name: 'Overhead Barbell Shoulder Press',
        category: 'shoulders',
        description: 'Standing overhead press for shoulder strength and core stability.',
        targetMuscles: ['Deltoids', 'Traps', 'Triceps'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
      },
      {
        name: 'Barbell Bicep Curl',
        category: 'arms',
        description: 'Isolation exercise focusing on bicep hypertrophy.',
        targetMuscles: ['Biceps Brachii', 'Forearms'],
        equipment: 'Barbell',
        difficulty: 'beginner',
      },
      {
        name: 'Cable Tricep Pushdown',
        category: 'arms',
        description: 'Cable isolation movement targeting lateral and long heads of the triceps.',
        targetMuscles: ['Triceps'],
        equipment: 'Cable Machine, Rope / Bar',
        difficulty: 'beginner',
      },
      {
        name: 'Plank Hold',
        category: 'core',
        description: 'Isometric core stability exercise strengthening abdominal wall and lower back.',
        targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Lower Back'],
        equipment: 'Yoga Mat',
        difficulty: 'beginner',
      },
      {
        name: 'HIIT Treadmill Sprints',
        category: 'cardio',
        description: 'High intensity cardiovascular intervals alternating sprinting with walking recovery.',
        targetMuscles: ['Cardiovascular System', 'Calves', 'Hamstrings'],
        equipment: 'Treadmill',
        difficulty: 'intermediate',
      },
    ];

    for (const ex of sampleExercises) {
      const exists = await Exercise.findOne({ name: ex.name });
      if (!exists) {
        await Exercise.create(ex);
      }
    }
    console.log('[Seed] Sample exercise library verified/seeded.');

    // 4. Seed Demonstration Trainers
    const trainerData = [
      {
        name: 'Hamza Khan',
        email: 'hamza.trainer@fittrack.com',
        password: 'Trainer@FitTrack2026!',
        phone: '+923019876543',
        role: ROLES.TRAINER,
        specialization: 'Strength & Hypertrophy Conditioning',
        monthlySalary: 65000,
        joiningDate: new Date('2024-01-15'),
        isActive: true,
        mustChangePassword: false,
      },
      {
        name: 'Sara Ahmed',
        email: 'sara.trainer@fittrack.com',
        password: 'Trainer@FitTrack2026!',
        phone: '+923028765432',
        role: ROLES.TRAINER,
        specialization: 'Fat Loss, Mobility & Functional Training',
        monthlySalary: 60000,
        joiningDate: new Date('2024-03-01'),
        isActive: true,
        mustChangePassword: false,
      },
    ];

    const seededTrainers = [];
    for (const t of trainerData) {
      let trainer = await User.findOne({ email: t.email });
      if (!trainer) {
        trainer = await User.create(t);
        console.log(`[Seed] Trainer created: ${t.name} (${t.email})`);
      }
      seededTrainers.push(trainer);
    }

    // 5. Seed Demonstration Member
    const memberEmail = 'ali.member@fittrack.com';
    let member = await User.findOne({ email: memberEmail });
    if (!member) {
      member = await User.create({
        name: 'Ali Raza',
        email: memberEmail,
        password: 'Member@FitTrack2026!',
        phone: '+923331122334',
        role: ROLES.MEMBER,
        assignedTrainer: seededTrainers[0]._id,
        emergencyContact: {
          name: 'Tariq Raza',
          phone: '+923339988776',
        },
        isActive: true,
        mustChangePassword: false,
      });
      console.log(`[Seed] Demo member created: ${member.name} (${member.email})`);
    }

    console.log('================================================================');
    console.log(' SEEDING COMPLETE! Test credentials:');
    console.log(`   Admin:   ${adminEmail} / ${adminPassword}`);
    console.log(`   Trainer: hamza.trainer@fittrack.com / Trainer@FitTrack2026!`);
    console.log(`   Member:  ali.member@fittrack.com / Member@FitTrack2026!`);
    console.log('================================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

