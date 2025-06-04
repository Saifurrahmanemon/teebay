import { Container } from '@mantine/core';

import { RegisterForm } from '@/components/auth/register-form';

export function RegisterPage() {
  return (
    <Container size="xs" py="xl">
      <RegisterForm />
    </Container>
  );
}
