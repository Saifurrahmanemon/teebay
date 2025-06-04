//TODO: make data persist even after reload(backend ready)

import { useState } from 'react';
import { useForm } from '@mantine/form';
import { z } from 'zod';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  MultiSelect,
  Textarea,
  NumberInput,
  Select,
  Stack,
  Title,
  Text,
  Badge,
} from '@mantine/core';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import {
  ProductTitleStepSchema,
  ProductCategoriesStepSchema,
  ProductDescriptionStepSchema,
  ProductPricingStepSchema,
  ProductSchema,
} from '@teebay/validations';

import { CREATE_PRODUCT_STEP, SUBMIT_PRODUCT_FORM } from '@/graphql/products';

const categories = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'HOME_APPLIANCES', label: 'Home Appliances' },
  { value: 'SPORTING_GOODS', label: 'Sporting Goods' },
  { value: 'OUTDOOR', label: 'Outdoor' },
  { value: 'TOYS', label: 'Toys' },
];

const rentPeriods = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

export function ProductForm() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      title: '',
      categories: [],
      description: '',
      price: 0,
      rentPrice: 0,
      rentPeriod: 'DAILY',
    },
  });

  const [createStep] = useMutation(CREATE_PRODUCT_STEP, {
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const [submitForm, { loading }] = useMutation(SUBMIT_PRODUCT_FORM, {
    onCompleted: () => {
      notifications.show({
        title: 'Success',
        message: 'Product created successfully',
        color: 'green',
      });
      navigate('/');
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const validateCurrentStep = () => {
    try {
      switch (active) {
        case 0:
          ProductTitleStepSchema.parse(form.values);
          break;
        case 1:
          ProductCategoriesStepSchema.parse(form.values);
          break;
        case 2:
          ProductDescriptionStepSchema.parse(form.values);
          break;
        case 3:
          ProductPricingStepSchema.parse(form.values);
          break;
        default:
          break;
      }
      return false; // No errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        form.setErrors(fieldErrors);
      }
      return true; // Has errors
    }
  };

  const nextStep = async () => {
    const hasErrors = validateCurrentStep();
    if (hasErrors) return;

    await createStep({
      variables: {
        step: active + 1,
        formData: form.values,
      },
    });

    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleSubmit = async () => {
    try {
      ProductSchema.parse(form.values);
      await submitForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        notifications.show({
          title: 'Validation Error',
          message: 'Please complete all required fields',
          color: 'red',
        });
      }
    }
  };

  return (
    <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
      <Stepper.Step label="Title" description="Product title">
        <Stack gap="md" mt="md">
          <Title order={3}>What are you listing?</Title>
          <TextInput
            label="Title"
            placeholder="Product title (5-100 characters)"
            withAsterisk
            {...form.getInputProps('title')}
          />
        </Stack>
      </Stepper.Step>

      <Stepper.Step label="Categories" description="Product categories">
        <Stack gap="md" mt="md">
          <Title order={3}>Select categories</Title>
          <MultiSelect
            label="Categories"
            placeholder="Select at least one category"
            data={categories}
            withAsterisk
            {...form.getInputProps('categories')}
          />
        </Stack>
      </Stepper.Step>

      <Stepper.Step label="Description" description="Product details">
        <Stack gap="md" mt="md">
          <Title order={3}>Describe your product</Title>
          <Textarea
            label="Description"
            placeholder="Detailed description (20-1000 characters)"
            autosize
            minRows={4}
            withAsterisk
            {...form.getInputProps('description')}
          />
        </Stack>
      </Stepper.Step>

      <Stepper.Step label="Pricing" description="Price and rent">
        <Stack gap="md" mt="md">
          <Title order={3}>Set your prices</Title>
          <NumberInput
            label="Price"
            placeholder="Selling price"
            prefix="$"
            min={0}
            withAsterisk
            {...form.getInputProps('price')}
          />
          <Group grow>
            <NumberInput
              label="Rent price"
              placeholder="Rental price"
              prefix="$"
              min={0}
              withAsterisk
              {...form.getInputProps('rentPrice')}
            />
            <Select
              label="Rent period"
              data={rentPeriods}
              withAsterisk
              {...form.getInputProps('rentPeriod')}
            />
          </Group>
        </Stack>
      </Stepper.Step>

      <Stepper.Step label="Review" description="Confirm details">
        <Stack gap="md" mt="md">
          <Title order={3}>Summery:</Title>
          <Text size="lg" fw={500}>
            Title: {form.values.title}
          </Text>
          <Group gap="xs">
            <Text>Categories: </Text>{' '}
            {form.values.categories.map((cat: string) => (
              <Badge key={cat}>{cat}</Badge>
            ))}
          </Group>
          <Text>Description: {form.values.description}</Text>
          <Group>
            <Text fw={500}>Price: ${Number(form.values?.price).toFixed(2)}</Text>
            <Text>
              Rent: ${Number(form.values?.rentPrice).toFixed(2)}/
              {form.values?.rentPeriod?.toLowerCase()}
            </Text>
          </Group>
        </Stack>
      </Stepper.Step>

      <Stepper.Completed>
        <Stack gap="md" mt="md">
          <Title order={3}>Listing complete!</Title>
          <Text>Your product is ready to be listed.</Text>
        </Stack>
      </Stepper.Completed>

      <Group justify="center" mt="xl">
        {active !== 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active !== 4 && <Button onClick={nextStep}>Next step</Button>}
        {active === 4 && (
          <Button loading={loading} onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Group>
    </Stepper>
  );
}
