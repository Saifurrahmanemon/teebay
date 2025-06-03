import { gql } from '@apollo/client';

export const GET_PRODUCTS_BY_USER = gql`
  query GetProductsByUser($userId: ID!) {
    getProductsByUser(userId: $userId) {
      id
      title
      description
      price
      rentPrice
      rentPeriod
      categories
      isAvailable
      isDeleted
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const GET_AVAILABLE_PRODUCTS = gql`
  query GetAvailableProducts {
    getAvailableProducts {
      id
      title
      description
      price
      rentPrice
      rentPeriod
      categories
      user {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

export const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: Int!) {
    buyProduct(productId: $productId) {
      id
      product {
        id
        title
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: Int!
    $title: String
    $description: String
    $price: Float
    $rentPrice: Float
    $rentPeriod: RentPeriod
    $categories: [Category!]
  ) {
    updateProduct(
      id: $id
      title: $title
      description: $description
      price: $price
      rentPrice: $rentPrice
      rentPeriod: $rentPeriod
      categories: $categories
    ) {
      id
      title
      description
      price
      rentPrice
      rentPeriod
      categories
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      price
      rentPrice
      rentPeriod
      categories
      createdAt
      isAvailable
    }
  }
`;
