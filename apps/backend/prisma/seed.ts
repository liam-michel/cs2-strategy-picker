import { hashPassword } from 'better-auth/crypto'

import { createKyselyClient } from '../src/storage/kysely-client'

const { db: client } = await createKyselyClient({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mydatabase',
})
//eslint-disable-next-line
const password = 'password123'

async function seed() {
  const hashedPassword = await hashPassword(password)

  try {
    await client
      .insertInto('User')
      .values([
        { id: 'user1', name: 'Test User 1', email: 'test1@example.com', updatedAt: new Date() },
        { id: 'user2', name: 'Test User 2', email: 'test2@example.com', updatedAt: new Date() },
      ])
      .onConflict((oc) => oc.doNothing())
      .execute()

    await client
      .insertInto('Account')
      .values([
        {
          id: 'user1',
          userId: 'user1',
          accountId: 'user1',
          providerId: 'credential',
          password: hashedPassword,
          updatedAt: new Date(),
        },
        {
          id: 'user2',
          userId: 'user2',
          accountId: 'user2',
          providerId: 'credential',
          password: hashedPassword,
          updatedAt: new Date(),
        },
      ])
      .onConflict((oc) => oc.doNothing())
      .execute()
  } catch (error) {
    //eslint-disable-next-line
    console.error('Error seeding users/accounts:', error)
  }

  try {
    await client
      .insertInto('Map')
      .values([
        { id: crypto.randomUUID(), name: 'Dust II' },
        { id: crypto.randomUUID(), name: 'Inferno' },
        { id: crypto.randomUUID(), name: 'Mirage' },
        { id: crypto.randomUUID(), name: 'Nuke' },
        { id: crypto.randomUUID(), name: 'Overpass' },
        { id: crypto.randomUUID(), name: 'Vertigo' },
        { id: crypto.randomUUID(), name: 'Ancient' },
        { id: crypto.randomUUID(), name: 'Train' },
      ])
      .onConflict((oc) => oc.doNothing())
      .execute()
  } catch (error) {
    //eslint-disable-next-line
    console.error('Error seeding maps:', error)
  }
}
//eslint-disable-next-line
await seed()
  //eslint-disable-next-line
  .catch((e) => console.error(e))
  .finally(() => process.exit())
