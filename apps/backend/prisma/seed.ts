//seeding script for some basic base information (maps)
import { PrismaClient } from '@prisma/client'

async function seed() {
  const prisma = new PrismaClient()
  //try to seed two test users, and the maps
  try {
    await prisma.user.createMany({
      data: [
        {
          id: 'user1',
          name: 'Test User 1',
          email: 'test1@example.com',
        },
        {
          id: 'user2',
          name: 'Test User 2',
          email: ' test2@example.com',
        },
      ],
    })
  } catch (error) {
    //log error but continue seeding
    //ignore no console lint here
    // eslint-disable-next-line no-console
    console.error('Error seeding users:', error)
  }
  //try to seed the maps
  try {
    await prisma.map.createMany({
      data: [
        { name: 'Dust II' },
        { name: 'Inferno' },
        { name: 'Mirage' },
        { name: 'Nuke' },
        { name: 'Overpass' },
        { name: 'Vertigo' },
        { name: 'Ancient' },
        { name: 'Train' },
      ],
    })
  } catch (error) {
    //log error but continue seeding
    // eslint-disable-next-line no-console
    console.error('Error seeding maps:', error)
  }
}

const main = async () => {
  await seed()
}
//ignore all eslint rules here
// eslint-disable-next-line
main()
  //eslint-disable-next-line
  .catch((e) => console.error(e))
  .finally(() => process.exit())
