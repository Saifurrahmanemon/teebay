// src/components/products/ProductList.tsx
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_USER, GET_AVAILABLE_PRODUCTS } from '@/graphql/products';
import {
  SimpleGrid,
  Skeleton,
  Title,
  Container,
  Stack,
  Button,
  Center,
  Flex,
  Divider,
  Text,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useAuth } from '@/context/auth-context';
import { ProductCard } from './product-card';
import { useNavigate } from 'react-router-dom';

const ProductListLoading = () => (
  <SimpleGrid cols={{ base: 1, sm: 1, md: 2 }} spacing="lg">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} height={300} radius="md" />
    ))}
  </SimpleGrid>
);

export function ProductList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading } = useQuery(GET_PRODUCTS_BY_USER, {
    variables: { userId: user?.id },
    fetchPolicy: 'cache-and-network',
  });

  const products = data?.getProductsByUser ?? [];

  return (
    <Container size="lg" py="lg">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>My Products</Title>
      </Flex>

      <Divider my="sm" />

      {loading ? (
        <ProductListLoading />
      ) : products.length > 0 ? (
        <Stack my="lg">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stack>
      ) : (
        <Center mt="xl">
          <Stack align="center">
            <Text c="dimmed" size="lg">
              You haven't listed any products yet.
            </Text>
          </Stack>
        </Center>
      )}

      <Flex justify="end">
        <Button onClick={() => navigate('/create-product')}>Add Product</Button>
      </Flex>
    </Container>
  );
}
