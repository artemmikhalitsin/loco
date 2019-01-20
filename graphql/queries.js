// eslint-disable
// this is an auto generated file. This will be overwritten

export const getCrime = `query GetCrime($id: ID!) {
  getCrime(id: $id) {
    id
    type
    description
    locX
    locY
    date
    timeset
  }
}
`;
export const listCrimes = `query ListCrimes(
  $filter: ModelCrimeFilterInput
  $limit: Int
  $nextToken: String
) {
  listCrimes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      type
      description
      locX
      locY
      date
      timeset
    }
    nextToken
  }
}
`;
