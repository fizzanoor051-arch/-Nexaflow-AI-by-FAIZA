/**
 * NexaFlow AI — Database Seed
 *
 * Database setup is intentionally deferred while
 * the frontend is being developed.
 *
 * When PostgreSQL + Prisma Client are configured,
 * this file can be expanded with demo records.
 */

async function main() {
  console.log("🌱 NexaFlow AI seed");
  console.log("Database seeding is currently disabled.");
  console.log(
    "Configure PostgreSQL and generate Prisma Client before enabling seed data."
  );
}

main().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});