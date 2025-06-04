import { Modal, Group, Button, Stack, Text } from '@mantine/core';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

import { BUY_PRODUCT } from '@/graphql/products';
import { Product } from '@/types';

interface BuyProductModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product;
}

export function BuyProductModal({ opened, onClose, product }: BuyProductModalProps) {
  const navigate = useNavigate();

  const [buyProduct, { loading }] = useMutation(BUY_PRODUCT, {
    variables: { productId: Number(product.id) },
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product purchased successfully',
        color: 'green',
      });
      navigate('/transactions');
      onClose();
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
    update: (cache) => {
      cache.evict({ id: `Product:${product.id}` });
      cache.gc();
    },
    refetchQueries: ['GetMyTransactions'],
    awaitRefetchQueries: true,
  });

  const handleConfirm = () => {
    buyProduct();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Buy ${product.title}`} centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Are you sure you want to buy <strong>{product.title}</strong> for{' '}
          <strong>${product?.price}</strong>?
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={loading}>
            Confirm Purchase
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
