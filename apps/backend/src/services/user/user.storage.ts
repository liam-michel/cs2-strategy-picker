import { IdInput } from '@cs2monorepo/shared'

import { SafeUser } from '../../common/schemas/user'
import { DbClient } from '../../storage/types'

export type UserStorageMethods = {
  findById: (data: IdInput) => Promise<SafeUser | null>
}

function findById(db: DbClient) {
  return async function (data: IdInput): Promise<SafeUser | null> {
    const user = await db.user.findUnique({
      where: { id: data.id },
    })
    if (!user) {
      return null
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}

export function createUserStorage(db: DbClient): UserStorageMethods {
  return {
    findById: findById(db),
  }
}
