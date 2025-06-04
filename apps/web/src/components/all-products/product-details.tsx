import { GET_PRODUCT } from '@/graphql/products';
import { useQuery } from '@apollo/client';
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RentProductModal } from './rent-modal';

function ProductDetailsComponent({ productId }: { productId: string }) {
  const [rentOpened, { open: openRent, close: closeRent }] = useDisclosure(false);
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });

  const skeleton = (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack m="sm">
        <Skeleton height={30} width="60%" radius="sm" />
        <Group m="xs">
          <Skeleton height={24} width={80} radius="xl" />
          <Skeleton height={24} width={100} radius="xl" />
        </Group>
        <Skeleton height={100} radius="sm" />
        <Group mt="md">
          <Skeleton height={20} width={120} />
          <Skeleton height={20} width={180} />
        </Group>
      </Stack>
    </Card>
  );

  if (loading) {
    return <Container my="xl">{skeleton}</Container>;
  }

  if (error || !data?.getProduct) {
    return (
      <Container my="xl">
        <Text size="xl">Failed to load product details.</Text>
      </Container>
    );
  }

  const product = data.getProduct;

  return (
    <Container my="xl">
      <Card>
        <Stack m="sm">
          <Title order={2}>{product.title}</Title>
          <Group>
            Categories:{' '}
            {product.categories.map((cat: string) => (
              <Badge key={cat}>{cat}</Badge>
            ))}
          </Group>
          <Stack mt="md">
            <Text c="dimmed" fw={500}>
              Price: ${product.price.toFixed(2)}
            </Text>
            <Text c="dimmed">
              Rent: ${product.rentPrice.toFixed(2)} / {product.rentPeriod.toLowerCase()}
            </Text>
          </Stack>
          <Text>{product.description}</Text>
        </Stack>
      </Card>

      <Flex my="lg" justify="end" gap={10}>
        <Button>Buy</Button>
        <Button variant="light" onClick={openRent}>
          Rent
        </Button>
      </Flex>

      <RentProductModal opened={rentOpened} onClose={closeRent} product={product} />
    </Container>
  );
}

export default ProductDetailsComponent;
