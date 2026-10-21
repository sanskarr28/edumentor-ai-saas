const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/edumentor'
});

async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS study_pod_memberships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        inviter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invitee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_inviter_invitee UNIQUE (inviter_id, invitee_id)
      );

      CREATE TABLE IF NOT EXISTS study_pod_defenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic TEXT NOT NULL,
        challenge_question TEXT NOT NULL,
        student_answer TEXT NOT NULL,
        score INTEGER NOT NULL,
        verdict TEXT NOT NULL,
        synthesis_summary TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS study_pod_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        topic TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log("TABLES CREATED SUCCESSFULLY");
  } catch (err) {
    console.error("MIGRATION ERROR:", err);
  } finally {
    await pool.end();
  }
}

main();
