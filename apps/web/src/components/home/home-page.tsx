import { Button, Title } from "@mantine/core";
import { useAuth } from "@/context/auth-context";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Title>Welcome, {user?.firstName}!</Title>
      <Button onClick={logout} mt="md">
        Logout
      </Button>
    </div>
  );
}
