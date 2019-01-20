// eslint-disable
// this is an auto generated file. This will be overwritten

export const createCrime = `mutation CreateCrime($input: CreateCrimeInput!) {
  createCrime(input: $input) {
    id
    type
    lon
    lat
    date
    timeset
  }
}
`;
export const updateCrime = `mutation UpdateCrime($input: UpdateCrimeInput!) {
  updateCrime(input: $input) {
    id
    type
    lon
    lat
    date
    timeset
  }
}
`;
export const deleteCrime = `mutation DeleteCrime($input: DeleteCrimeInput!) {
  deleteCrime(input: $input) {
    id
    type
    lon
    lat
    date
    timeset
  }
}
`;
export const createCall311 = `mutation CreateCall311($input: CreateCall311Input!) {
  createCall311(input: $input) {
    id
    type
    lon
    lat
    date
  }
}
`;
export const updateCall311 = `mutation UpdateCall311($input: UpdateCall311Input!) {
  updateCall311(input: $input) {
    id
    type
    lon
    lat
    date
  }
}
`;
export const deleteCall311 = `mutation DeleteCall311($input: DeleteCall311Input!) {
  deleteCall311(input: $input) {
    id
    type
    lon
    lat
    date
  }
}
`;
export const createFoodInfraction = `mutation CreateFoodInfraction($input: CreateFoodInfractionInput!) {
  createFoodInfraction(input: $input) {
    id
    lat
    lon
    restoName
    reason
    fine
  }
}
`;
export const updateFoodInfraction = `mutation UpdateFoodInfraction($input: UpdateFoodInfractionInput!) {
  updateFoodInfraction(input: $input) {
    id
    lat
    lon
    restoName
    reason
    fine
  }
}
`;
export const deleteFoodInfraction = `mutation DeleteFoodInfraction($input: DeleteFoodInfractionInput!) {
  deleteFoodInfraction(input: $input) {
    id
    lat
    lon
    restoName
    reason
    fine
  }
}
`;
