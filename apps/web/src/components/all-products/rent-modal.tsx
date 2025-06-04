// src/components/products/RentProductModal.tsx
import { Modal, Group, Button, Stack, Text, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@apollo/client';
import { GET_MY_TRANSACTIONS, RENT_PRODUCT } from '@/graphql/products';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import { calculateRentalTotal } from '@/utils/calculate-total-rent';
import { useNavigate } from 'react-router-dom';

interface RentProductModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product;
}

export function RentProductModal({ opened, onClose, product }: RentProductModalProps) {
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState(0);
  const form = useForm({
    initialValues: {
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
  });

  const [rentProduct, { loading, data }] = useMutation(RENT_PRODUCT, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product rented successfully',
        color: 'green',
      });
      navigate('/transactions');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },

    refetchQueries: [{ query: GET_MY_TRANSACTIONS }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    const { fromDate, toDate } = form.values;
    if (fromDate && toDate) {
      const cost = calculateRentalTotal(fromDate, toDate, product.rentPrice, product.rentPeriod);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
  }, [form.values.fromDate, form.values.toDate, product.rentPeriod, product.rentPrice]);

  const parseDateString = (dateStr: Date | string): Date => {
    if (dateStr instanceof Date) return dateStr;
    return new Date(dateStr);
  };

  const handleSubmit = (values: { fromDate: Date | null; toDate: Date | null }) => {
    if (!values.fromDate || !values.toDate) {
      notifications.show({
        title: 'Error',
        message: 'Please select both start and end dates',
        color: 'red',
      });
      return;
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    rentProduct({
      variables: {
        productId: Number(product.id),
        fromDate: values.fromDate instanceof Date ? formatDate(values.fromDate) : values.fromDate,
        toDate: values.toDate instanceof Date ? formatDate(values.toDate) : values.toDate,
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`Rent ${product.title}`} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Rent Price: ${product.rentPrice} per {product.rentPeriod.toLowerCase()}
          </Text>

          <DatePickerInput
            label="From Date"
            placeholder="Pick start date"
            minDate={new Date()}
            leftSection={<IconCalendar size={16} />}
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps('fromDate')}
          />

          <DatePickerInput
            label="To Date"
            placeholder="Pick end date"
            minDate={form.values.fromDate || new Date()}
            leftSection={<IconCalendar size={16} />}
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps('toDate')}
          />

          <NumberInput
            label="Total Cost"
            value={totalCost.toFixed(2)}
            prefix="$"
            disabled
            thousandSeparator
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!form.values.fromDate || !form.values.toDate || totalCost <= 0}
            >
              Confirm Rental
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}