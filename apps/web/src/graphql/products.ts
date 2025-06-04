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

export const CREATE_PRODUCT_STEP = gql`
  mutation CreateProductStep($step: Int!, $formData: ProductFormInput!) {
    createProductStep(step: $step, formData: $formData) {
      step
      totalSteps
      formData {
        title
        categories
        description
        price
        rentPrice
        rentPeriod
      }
    }
  }
`;

export const SUBMIT_PRODUCT_FORM = gql`
  mutation SubmitProductForm {
    submitProductForm {
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

export const RENT_PRODUCT = gql`
  mutation RentProduct($productId: Int!, $fromDate: String!, $toDate: String!) {
    rentProduct(productId: $productId, fromDate: $fromDate, toDate: $toDate) {
      id
      fromDate
      toDate
    }
  }
`;

export const GET_MY_TRANSACTIONS = gql`
  query GetMyTransactions {
    getMyTransactions {
      purchases {
        id
        product {
          id
          title
          price
        }
        createdAt
      }
      sales {
        id
        product {
          id
          title
          price
        }
        createdAt
      }
      rentalsOut {
        id
        product {
          id
          title
          rentPrice
          rentPeriod
        }
        fromDate
        toDate
      }
      rentalsIn {
        id
        product {
          id
          title
          rentPrice
          rentPeriod
        }
        fromDate
        toDate
      }
    }
  }
`;
