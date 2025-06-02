import { RegisterForm } from "@/components/auth/register-form";
import { Container } from "@mantine/core";



export function RegisterPage() {
  return (
    <Container size="xs" py="xl">
      <RegisterForm />
    </Container>
  );
}
