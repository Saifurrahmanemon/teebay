import { GET_AVAILABLE_PRODUCTS } from '@/graphql/products';
import { useQuery } from '@apollo/client';
import { Title, Container, Stack, Button, Center, Flex, Divider, Text } from '@mantine/core';
import { ProductListLoading } from '../my-products/product-list';
import { ProductCard } from '../my-products/product-card';
import { Link } from 'react-router-dom';
import { Product } from '@/types';

function ProductListing() {
  const { loading, data: availableProductsData } = useQuery(GET_AVAILABLE_PRODUCTS);

  console.log(availableProductsData);

  return (
    <div>
      {' '}
      <Container size="md" py="lg">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={2}>All Available Products</Title>
        </Flex>

        <Divider my="sm" />

        {loading ? (
          <ProductListLoading />
        ) : availableProductsData?.getAvailableProducts.length > 0 ? (
          <Stack my="lg">
            {availableProductsData?.getAvailableProducts.map((product: Product) => (
              <Link
                style={{
                  cursor: 'pointer',
                }}
                to={`/products/${product.id}`}
              >
                <ProductCard key={product.id} product={product} />
              </Link>
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
      </Container>
    </div>
  );
}

export default ProductListing;
