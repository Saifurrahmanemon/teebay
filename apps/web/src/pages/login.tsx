import { Container } from '@mantine/core';

import { LoginForm } from '@/components/auth/login-form';

export function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <LoginForm />
    </Container>
  );
}
