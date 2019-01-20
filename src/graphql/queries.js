// eslint-disable
// this is an auto generated file. This will be overwritten

export const getCrime = `query GetCrime($id: ID!) {
  getCrime(id: $id) {
    id
    type
    lon
    lat
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
      lon
      lat
      date
      timeset
    }
    nextToken
  }
}
`;
export const getCall311 = `query GetCall311($id: ID!) {
  getCall311(id: $id) {
    id
    type
    lon
    lat
    date
  }
}
`;
export const listCall311s = `query ListCall311s(
  $filter: ModelCall311FilterInput
  $limit: Int
  $nextToken: String
) {
  listCall311s(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      type
      lon
      lat
      date
    }
    nextToken
  }
}
`;
export const getFoodInfraction = `query GetFoodInfraction($id: ID!) {
  getFoodInfraction(id: $id) {
    id
    lat
    lon
    restoName
    reason
    fine
  }
}
`;
export const listFoodInfractions = `query ListFoodInfractions(
  $filter: ModelFoodInfractionFilterInput
  $limit: Int
  $nextToken: String
) {
  listFoodInfractions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      lat
      lon
      restoName
      reason
      fine
    }
    nextToken
  }
}
`;
export const searchCrimes = `query SearchCrimes(
  $filter: SearchableCrimeFilterInput
  $sort: SearchableCrimeSortInput
  $limit: Int
  $nextToken: Int
) {
  searchCrimes(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      type
      lon
      lat
      date
      timeset
    }
    nextToken
  }
}
`;
export const searchCall311s = `query SearchCall311s(
  $filter: SearchableCall311FilterInput
  $sort: SearchableCall311SortInput
  $limit: Int
  $nextToken: Int
) {
  searchCall311s(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      type
      lon
      lat
      date
    }
    nextToken
  }
}
`;
export const searchFoodInfractions = `query SearchFoodInfractions(
  $filter: SearchableFoodInfractionFilterInput
  $sort: SearchableFoodInfractionSortInput
  $limit: Int
  $nextToken: Int
) {
  searchFoodInfractions(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      lat
      lon
      restoName
      reason
      fine
    }
    nextToken
  }
}
`;
