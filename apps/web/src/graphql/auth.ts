import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      phone
      address
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $phone: String
    $address: String
  ) {
    register(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      address: $address
    ) {
      token
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;
