import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

export function useQueryParams() {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      history: 'push',
    },
  )

  return {
    params,
    setParams,
  }
}
