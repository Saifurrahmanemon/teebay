/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from '@mantine/form';
import { useMutation } from '@apollo/client';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
  Card,
  Flex,
  Box,
  Grid,
  LoadingOverlay,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { IconAt, IconLock, IconUser, IconPhone, IconHome } from '@tabler/icons-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import { registerSchema } from '@teebay/validations';

import { useAuth } from '@/context/auth-context';
import { REGISTER_MUTATION } from '@/graphql/auth';

export function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    },
    validate: zodResolver(registerSchema),
  });

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      login(data.register.token, data.register.user);
      notifications.show({
        title: 'Welcome!',
        message: 'Your account has been created successfully',
        color: 'teal',
        withCloseButton: true,
        icon: <IconUser size={18} />,
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Registration failed',
        message: error.message.includes('already exists')
          ? 'An account with this email already exists'
          : error.message,
        color: 'red',
        withCloseButton: true,
      });
    },
  });

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleSubmit = (values: any) => {
    const { confirmPassword, ...submitValues } = values;

    registerMutation({
      variables: submitValues,
    });
  };

  return (
    <Flex align="center" justify="center" mih="80vh" p="md">
      <Card withBorder shadow="lg" p="xl" radius="lg" w="100%" maw={900} pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'lg', blur: 2 }}
          loaderProps={{ type: 'dots' }}
        />

        <Box mb="xl" ta="center">
          <Title order={2} fw={700} mb="xs">
            Create Your Account
          </Title>
          <Text c="dimmed" size="sm">
            Join us to get started
          </Text>
        </Box>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="First Name"
                  placeholder="John"
                  leftSection={<IconUser size={18} />}
                  size="md"
                  withAsterisk
                  {...form.getInputProps('firstName')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Last Name"
                  placeholder="Doe"
                  leftSection={<IconUser size={18} />}
                  size="md"
                  withAsterisk
                  {...form.getInputProps('lastName')}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Address"
              placeholder="Address"
              leftSection={<IconHome size={18} />}
              size="md"
              {...form.getInputProps('address')}
            />

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  leftSection={<IconAt size={18} />}
                  size="md"
                  withAsterisk
                  {...form.getInputProps('email')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Phone"
                  placeholder="Phone Number"
                  leftSection={<IconPhone size={18} />}
                  size="md"
                  {...form.getInputProps('phone')}
                />
              </Grid.Col>
            </Grid>

            <PasswordInput
              label="Password"
              placeholder="At least 6 characters"
              leftSection={<IconLock size={18} />}
              size="md"
              withAsterisk
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              leftSection={<IconLock size={18} />}
              size="md"
              withAsterisk
              {...form.getInputProps('confirmPassword')}
            />

            <Button type="submit" loading={loading} fullWidth mt="md" size="md">
              Create Account
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="xl" c="dimmed" size="sm">
          Already have an account?{' '}
          <Anchor component="button" type="button" fw={600} onClick={() => navigate('/login')}>
            Sign in
          </Anchor>
        </Text>
      </Card>
    </Flex>
  );
}
