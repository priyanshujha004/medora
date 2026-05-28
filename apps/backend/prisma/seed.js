const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const doctor = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medora.com',
      password: hashedPassword,
      role: 'DOCTOR',
      doctorProfile: {
        create: {
          age: 38,
          experience: 12,
          speciality: 'Cardiology',
          clinicAddress: '12 Wellness Ave, Mumbai',
          fees: 800,
          timings: 'Mon-Fri 9am-5pm',
        },
      },
    },
  });

  const patient = await prisma.user.create({
    data: {
      name: 'Ravi Mehta',
      email: 'ravi.mehta@email.com',
      password: hashedPassword,
      role: 'PATIENT',
      patientProfile: {
        create: {
          age: 30,
          contactInfo: '+91 98765 43210',
          bloodGroup: 'B+',
          address: '45 Green Park, Delhi',
        },
      },
    },
  });

  console.log('Seeded doctor:', doctor.email);
  console.log('Seeded patient:', patient.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
