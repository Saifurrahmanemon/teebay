import {
  AppShell,
  Text,
  Group,
  Button,
  Anchor,
  Menu,
  Divider,
} from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IconShoppingCart,
  IconList,
  IconUser,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@apollo/client';
import { ReactElement } from 'react';

import { GET_CURRENT_USER } from '@/graphql/auth';
import { useAuth } from '@/context/auth-context';

export function DashboardLayout({ children }: { children: ReactElement }) {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = useQuery(GET_CURRENT_USER, {
    skip: !authUser,
  });

  const user = data?.me || authUser;

  const handleLogout = () => {
    logout();
    notifications.show({
      title: 'Logged out',
      message: 'You have been successfully logged out',
      color: 'green',
    });
    navigate('/login');
  };

  const navLinks = [
    { label: 'All Products', to: '/products', icon: <IconList size={16} /> },
    { label: 'My Products', to: '/', icon: <IconShoppingCart size={16} /> },
    { label: 'My Transactions', to: '/transactions', icon: <IconUser size={16} /> },
  ];

  const isActive = (to: string) => {
    return location.pathname === to;
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: true },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Navbar p="xs">
        <AppShell.Section grow my="md">
          <Group gap="xs">
            {navLinks.map(({ label, to, icon }) => (
              <Button
                key={to}
                component={Link}
                to={to}
                variant={isActive(to) ? 'light' : 'subtle'}
                color={isActive(to) ? 'violet' : 'gray'}
                leftSection={icon}
                fullWidth
                justify="flex-start"
              >
                {label}
              </Button>
            ))}
          </Group>
        </AppShell.Section>

        <AppShell.Section>
          <Divider mb="sm" />
          <Button
            onClick={handleLogout}
            variant="subtle"
            leftSection={<IconLogout size={16} />}
            fullWidth
            justify="flex-start"
            color="red"
          >
            Logout
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header p="xs">
        <Group justify="space-between">
          <Anchor component={Link} to="/" underline="never">
            <Text size="xl" fw={700} c="">
              Teebay
            </Text>
          </Anchor>

          {user && (
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <Button variant="light" leftSection={<IconUserCircle size={16} />}>
                  <Group gap="xs">
                    <Text>{user.firstName}</Text>
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>User Details</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  {user.firstName} {user.lastName}
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>{user.email}</Menu.Item>
                {user.phone && (
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Phone: {user.phone}
                  </Menu.Item>
                )}
                <Menu.Divider />
                <Menu.Label>Account</Menu.Label>

                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
