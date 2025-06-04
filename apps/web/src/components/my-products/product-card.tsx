import {
  Card,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  Modal,
  Divider,
  Stack,
  Tooltip,
} from '@mantine/core';
import {
  IconTrash,
  IconEdit,
  IconCalendar,
  IconClockHour4,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@apollo/client';

import { Product } from '@/types';
import { formatTimestampWithOrdinal } from '@/utils/dates';
import { DELETE_PRODUCT } from '@/graphql/products';

interface ProductCardProps {
  product: Product;
  isOwner?: boolean;
}

export function ProductCard({ product, isOwner = false }: ProductCardProps) {
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const navigate = useNavigate();

  const datePosted = formatTimestampWithOrdinal(Number(product?.createdAt));

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    variables: { id: product.id },
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
      closeDelete();
    },
    update: (cache) => {
      cache.evict({ id: `Product:${product.id}` });
      cache.gc();
    },
  });

  return (
    <>
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={600} size="lg">
            {product.title}
          </Text>
          {isOwner && (
            <Group gap="xs">
              <Tooltip label="Edit">
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                  }}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete">
                <ActionIcon variant="light" color="red" onClick={openDelete}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}
        </Group>

        <Group gap="xs" mb="sm" wrap="wrap">
          {product.categories.map((category: string) => (
            <Badge key={category} color="blue" variant="light">
              {category}
            </Badge>
          ))}
        </Group>

        <Stack gap="xs">
          <Group gap="xs">
            <Text fw={500} size="sm">
              Price: ${product.price.toFixed(2)}
            </Text>
          </Group>

          <Group gap="xs">
            <IconClockHour4 size={16} />
            <Text size="sm" c="dimmed">
              Rent: ${product.rentPrice.toFixed(2)} / {product.rentPeriod.toLowerCase()}
            </Text>
          </Group>
        </Stack>
        <Divider my="sm" />

        <Text size="sm" c="dark" mb="sm" lineClamp={3}>
          {product.description}
        </Text>

        <Group gap="xs">
          <IconCalendar size={16} />
          <Text size="sm" c="dark">
            Posted: {datePosted}
          </Text>
        </Group>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Product" centered>
        <Text mb="md">Are you sure you want to delete this product?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteProduct();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
