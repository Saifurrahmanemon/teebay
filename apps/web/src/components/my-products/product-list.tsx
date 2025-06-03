// src/components/products/ProductList.tsx
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_USER, GET_AVAILABLE_PRODUCTS } from '@/graphql/products';
import { SimpleGrid, Skeleton, Title, Tabs, Container, Stack } from '@mantine/core';
import { IconList, IconShoppingCart, IconExchange } from '@tabler/icons-react';
import { useAuth } from '@/context/auth-context';
import { ProductCard } from './product-card';

const ProductListLoading = () => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 1, lg: 1 }}>
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} height={300} />
      ))}
    </SimpleGrid>
  );
};

export function ProductList() {
  const { user } = useAuth();
  const query = useQuery(GET_PRODUCTS_BY_USER, {
    variables: { userId: user?.id },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <Container>
      <h1>My Products</h1>
      {query.loading ? (
        <ProductListLoading />
      ) : query?.data?.getProductsByUser?.length ? (
        <Stack mt="md">
          {query?.data?.getProductsByUser.map((product: any) => (
            <ProductCard key={product.id} product={product}  />
          ))}
        </Stack>
      ) : (
        <Title order={3} mt="md" c="dimmed">
          You haven't listed any products yet
        </Title>
      )}
    </Container>
  );
}
