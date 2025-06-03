export const typeDefs = `
  enum Category {
    ELECTRONICS
    FURNITURE
    HOME_APPLIANCES
    SPORTING_GOODS
    OUTDOOR
    TOYS
  }

  enum RentPeriod {
    HOURLY
    DAILY
    WEEKLY
    MONTHLY
  } 


  type User {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    phone: String
    address: String
    createdAt: String!
    updatedAt: String!
    products: [Product!]!
    sales: [Sale!]!
    purchases: [Sale!]!
    rentalsOut: [Rental!]!
    rentalsIn: [Rental!]!
  }

  type Product {
    id: Int!
    title: String!
    description: String!
    price: Float!
    rentPrice: Float!
    rentPeriod:  RentPeriod!
    categories: [Category!]!
    user: User!
    sales: [Sale!]!
    rentals: [Rental!]!
    createdAt: String!
    updatedAt: String!
    isDeleted: Boolean!
    isAvailable: Boolean!
  }

  type Sale {
    id: Int!
    product: Product!
    buyer: User!
    seller: User!
    createdAt: String!
  }

  type Rental {
    id: Int!
    product: Product!
    lender: User!
    borrower: User!
    fromDate: String!
    toDate: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type ProductFormSession {
  step: Int  
  totalSteps: Int    
  formData: ProductFormData!  
  }
    
  type ProductFormData {
    title: String
    categories: [Category!]
    description: String
    price: Float
    rentPrice: Float
    rentPeriod: RentPeriod
  }



  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    getProductsByUser(userId: ID!): [Product!]!
    getProductFormState(id: ID): ProductFormSession!
  }

  type Mutation {
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      phone: String
      address: String
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    createProductStep(step: Int!, formData: ProductFormInput!): ProductFormSession!
    submitProductForm: Product!
  }
    input ProductFormInput {
     title: String
     categories: [Category!]
     description: String
     price: Float
     rentPrice: Float
     rentPeriod: RentPeriod
    }
`;
