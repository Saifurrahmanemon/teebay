// src/components/products/RentProductModal.tsx
import { Modal, Group, Button, Stack, Text, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@apollo/client';
import { RENT_PRODUCT } from '@/graphql/products';
import { notifications } from '@mantine/notifications';
import { IconCalendar } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { Product } from '@/types';
import { useEffect, useState } from 'react';

interface RentProductModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product;
}

export function RentProductModal({ opened, onClose, product }: RentProductModalProps) {
  const [totalCost, setTotalCost] = useState(0);
  const form = useForm({
    initialValues: {
      fromDate: null as Date | null,
      toDate: null as Date | null,
    },
  });

  const [rentProduct, { loading }] = useMutation(RENT_PRODUCT, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product rented successfully',
        color: 'green',
      });
      onClose();
    },
    onError: (error) => {
      console.log(error)
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  useEffect(() => {
    const { fromDate, toDate } = form.values;
    if (fromDate && toDate) {
      const cost = calculateTotal(fromDate, toDate);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
  }, [form.values.fromDate, form.values.toDate]);

  const parseDateString = (dateStr: Date | string): Date => {
    if (dateStr instanceof Date) return dateStr;
    return new Date(dateStr);
  };

  const calculateTotal = (fromDate: Date | string, toDate: Date | string) => {
    try {
      const startDate = parseDateString(fromDate as string);
      const endDate = parseDateString(toDate as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
      
      const diffMs = endDate.getTime() - startDate.getTime();
      if (diffMs <= 0) return 0;

      let units = 1;
      const oneHour = 1000 * 60 * 60;
      const oneDay = oneHour * 24;
      const oneWeek = oneDay * 7;
      const oneMonth = oneDay * 30; 

      switch (product.rentPeriod) {
        case 'HOURLY':
          units = Math.max(1, Math.ceil(diffMs / oneHour));
          break;
        case 'DAILY':
          units = Math.max(1, Math.ceil(diffMs / oneDay));
          break;
        case 'WEEKLY':
          units = Math.max(1, Math.ceil(diffMs / oneWeek));
          break;
        case 'MONTHLY':
          units = Math.max(1, Math.ceil(diffMs / oneMonth));
          break;
        default:
          units = 1;
      }

      return units * product.rentPrice;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
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