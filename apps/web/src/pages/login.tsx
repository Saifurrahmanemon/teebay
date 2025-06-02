import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@mantine/core";

export function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <LoginForm />
    </Container>
  );
}
