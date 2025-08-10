const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const bookedSlotTimes = [
    "2025-08-10T10:19:58.507Z",
    "2025-08-10T11:15:44.822Z",
  ].map((d) => new Date(d).getTime());

  const startDate = new Date("2025-08-10T00:00:00Z"); // Start from this date (adjust as needed)
  const daysToGenerate = 30;

  // Slot duration: 30 minutes (as per your example)
  const SLOT_DURATION_MINUTES = 30;

  // Working hours: 9:00 to 17:00 (adjust as needed)
  const WORK_START_HOUR = 9;
  const WORK_END_HOUR = 17;

  const slots = [];

  for (let day = 0; day < daysToGenerate; day++) {
    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
      // For each hour, generate slots every 30 minutes: e.g., 9:00 and 9:30
      for (let min of [0, 30]) {
        const slotStart = new Date(startDate);
        slotStart.setUTCDate(slotStart.getUTCDate() + day);
        slotStart.setUTCHours(hour, min, 0, 0);

        const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);

        // Exclude booked slots by matching exact start time in milliseconds
        if (bookedSlotTimes.includes(slotStart.getTime())) {
          continue; // skip booked slot
        }

        slots.push({ startAt: slotStart, endAt: slotEnd });
      }
    }
  }

  // Create slots in DB
  for (const slot of slots) {
    await prisma.slot.create({ data: slot });
  }

  console.log(`Created ${slots.length} slots for next ${daysToGenerate} days`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
