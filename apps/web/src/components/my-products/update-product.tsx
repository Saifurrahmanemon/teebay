// src/components/products/UpdateProductModal.tsx
import {
  Modal,
  Stack,
  TextInput,
  MultiSelect,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  LoadingOverlay,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT, UPDATE_PRODUCT } from '@/graphql/products';
import { notifications } from '@mantine/notifications';
import { ProductSchema } from '@teebay/validations';
import { useEffect } from 'react';
import { CategoryName } from '@/types';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
const categories = [
  { value: CategoryName.ELECTRONICS, label: 'Electronics' },
  { value: CategoryName.FURNITURE, label: 'Furniture' },
  { value: CategoryName.HOME_APPLIANCES, label: 'Home Appliances' },
  { value: CategoryName.SPORTING_GOODS, label: 'Sporting Goods' },
  { value: CategoryName.OUTDOOR, label: 'Outdoor' },
  { value: CategoryName.TOYS, label: 'Toys' },
];

const rentPeriods = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

export default function UpdateMyProduct({ productId }: { productId: string }) {
  const navigate = useNavigate();
  const { data, loading: queryLoading } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });

  const form = useForm({
    validate: zodResolver(ProductSchema),
  });

  // Update form values when product data is loaded
  useEffect(() => {
    if (data?.getProduct) {
      form.setValues({
        title: data.getProduct.title,
        description: data.getProduct.description,
        price: data.getProduct.price,
        rentPrice: data.getProduct.rentPrice,
        rentPeriod: data.getProduct.rentPeriod,
        categories: data.getProduct.categories,
      });
    }
  }, [data]);

  const [updateProduct, { loading: mutationLoading }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
      });
      navigate('/');
    },
    onError: (error) => {
      console.log(error?.message);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleSubmit = (values: any) => {
    try {
      // Validate the input values against the ProductSchema
      const validatedData = ProductSchema.parse(values);
      
      updateProduct({
        variables: {
          id: Number(productId),
          ...validatedData,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to form errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        form.setErrors(fieldErrors);
        
        notifications.show({
          title: 'Validation Error',
          message: 'Please fix the form errors',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Error',
          message: 'An unexpected error occurred',
          color: 'red',
        });
      }
    }
  };


  return (
    <Container my={20}>
      <LoadingOverlay visible={queryLoading} />
      {data?.getProduct && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="Title" placeholder="Product title" {...form.getInputProps('title')} />

            <MultiSelect
              label="Categories"
              placeholder="Select categories"
              data={categories}
              {...form.getInputProps('categories')}
            />

            <Textarea
              label="Description"
              placeholder="Detailed description"
              autosize
              minRows={4}
              {...form.getInputProps('description')}
            />

            <NumberInput
              label="Price"
              placeholder="Selling price"
              prefix="$"
              min={0}
              {...form.getInputProps('price')}
            />

            <Group grow>
              <NumberInput
                label="Rent Price"
                placeholder="Rental price"
                prefix="$"
                min={0}
                {...form.getInputProps('rentPrice')}
              />
              <Select
                label="Rent Period"
                data={rentPeriods}
                {...form.getInputProps('rentPeriod')}
              />
            </Group>

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={mutationLoading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Container>
  );
}
