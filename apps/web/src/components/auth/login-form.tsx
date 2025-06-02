import { useForm } from "@mantine/form";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/auth";
import { loginSchema } from "@/schemas/auth";
import { zodResolver } from "mantine-form-zod-resolver";
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
  Image,
  rem,
  Group,
  Divider,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { notifications } from "@mantine/notifications";
import {
  IconAt,
  IconLock,
  IconBrandGoogle,
  IconBrandGithub,
} from "@tabler/icons-react";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.token, data.login.user);
      notifications.show({
        title: "Welcome back!",
        message: "You have successfully logged in",
        color: "teal",
        withCloseButton: true,
        icon: <IconAt size={18} />,
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Login failed",
        message: error.message,
        color: "red",
        withCloseButton: true,
      });
    },
  });

  const handleSubmit = (values: any) => {
    loginMutation({
      variables: {
        email: values.email,
        password: values.password,
      },
    });
  };

  return (
    <Flex align="center" justify="center" mih="80vh" p="md">
      <Card
        withBorder
        shadow="md"
        p="xl"
        radius="md"
        w="100%"
        maw={480}
        style={{ backdropFilter: "blur(8px)" }}
      >
        <Box mb="xl" ta="center">
          <Title order={2} fw={700}>
            Welcome back
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Sign in to your account to continue
          </Text>
        </Box>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email address"
              placeholder="your@email.com"
              leftSection={<IconAt size={18} />}
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size={18} />}
              {...form.getInputProps("password")}
            />

            <Group justify="space-between" mt="xs">
              <Anchor
                component="button"
                type="button"
                size="xs"
                c="dimmed"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Anchor>
            </Group>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              mt="md"
              size="md"
            >
              Sign in
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="xl" c="dimmed" size="sm">
          Don't have an account?{" "}
          <Anchor
            component="button"
            type="button"
            fw={600}
            onClick={() => navigate("/register")}
          >
            Create account
          </Anchor>
        </Text>
      </Card>
    </Flex>
  );
}
