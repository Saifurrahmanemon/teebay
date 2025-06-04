import { useQuery } from '@apollo/client';
import {
  Table,
  Badge,
  Title,
  Text,
  Group,
  Tabs,
  Loader,
  Center,
  Alert,
  Container,
} from '@mantine/core';
import { IconShoppingCart, IconExchange, IconAlertCircle } from '@tabler/icons-react';

import { GET_MY_TRANSACTIONS } from '@/graphql/products';
import { formatTimestampWithOrdinal } from '@/utils/dates';
import { calculateRentalTotal } from '@/utils/calculate-total-rent';

export function TransactionsPanel() {
  const { loading, error, data } = useQuery(GET_MY_TRANSACTIONS);

  if (loading) {
    return (
      <Center h={200}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        withCloseButton
        closeButtonLabel="Close alert"
      >
        Failed to load transactions. Please try again later.
      </Alert>
    );
  }

  const transactions = data?.getMyTransactions || {
    purchases: [],
    sales: [],
    rentalsOut: [],
    rentalsIn: [],
  };

  return (
    <div>
      <Title order={3} mb="md">
        My Transactions
      </Title>

      <Tabs defaultValue="purchases">
        <Tabs.List>
          <Tabs.Tab value="purchases" leftSection={<IconShoppingCart size={14} />}>
            Purchases
          </Tabs.Tab>
          <Tabs.Tab value="sales" leftSection={<IconShoppingCart size={14} />}>
            Sales
          </Tabs.Tab>
          <Tabs.Tab value="rentalsOut" leftSection={<IconExchange size={14} />}>
            Rentals Out
          </Tabs.Tab>
          <Tabs.Tab value="rentalsIn" leftSection={<IconExchange size={14} />}>
            Rentals In
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="purchases">
          <TransactionTable
            data={transactions?.purchases}
            type="purchase"
            columns={['Product', 'Price', 'Date']}
          />
        </Tabs.Panel>

        <Tabs.Panel value="sales">
          <TransactionTable
            data={transactions?.sales}
            type="sale"
            columns={['Product', 'Price', 'Date']}
          />
        </Tabs.Panel>

        <Tabs.Panel value="rentalsOut">
          <TransactionTable
            data={transactions?.rentalsOut}
            type="rentalOut"
            columns={['Product', 'Rent Price', 'Period']}
          />
        </Tabs.Panel>

        <Tabs.Panel value="rentalsIn">
          <TransactionTable
            data={transactions?.rentalsIn}
            type="rentalIn"
            columns={['Product', 'Rent Price', 'Period']}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
function TransactionTable({
  data,
  type,
  columns,
}: {
  data: any[];
  type: string;
  columns: string[];
}) {
  if (data?.length === 0) {
    return (
      <Container my={20}>
        <Alert icon={<IconAlertCircle size={16} />} color="red" closeButtonLabel="Close alert">
          No {type.replace(/([A-Z])/g, ' $1').toLowerCase()} found
        </Alert>
      </Container>
    );
  }
  const showRental = type.includes('rental');

  return (
    <Table mt="md">
      <Table.Thead>
        <Table.Tr>
          {columns.map((col) => (
            <Table.Th key={col}>{col}</Table.Th>
          ))}

          {showRental && <Table.Th>Total Rent</Table.Th>}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((item) => {
          const { fromDate, toDate, product } = item;
          const rentPrice = product?.rentPrice;
          const rentPeriod = product?.rentPeriod;

          let rowTotal = 'N/A';

          if (
            showRental &&
            rentPrice != null &&
            rentPeriod &&
            fromDate &&
            toDate &&
            !isNaN(Number(fromDate)) &&
            !isNaN(Number(toDate))
          ) {
            const startDate = new Date(Number(fromDate));
            const endDate = new Date(Number(toDate));

            const total = calculateRentalTotal(startDate, endDate, rentPrice, rentPeriod);
            rowTotal = `${total.toFixed(2)}`;
          }
          return (
            <Table.Tr key={item?.id ?? Math.random()}>
              <Table.Td>{item?.product?.title ?? 'N/A'}</Table.Td>
              <Table.Td>
                {type.includes('rental')
                  ? item?.product?.rentPrice != null
                    ? `$${item.product.rentPrice.toFixed(2)}`
                    : 'N/A'
                  : item?.product?.price != null
                    ? `$${item.product.price.toFixed(2)}`
                    : 'N/A'}
              </Table.Td>
              <Table.Td>
                {type.includes('rental') ? (
                  <Group gap="xs">
                    <Badge variant="light">
                      {formatTimestampWithOrdinal(Number(item?.fromDate))}
                    </Badge>
                    <Text>to</Text>
                    <Badge variant="light">
                      {formatTimestampWithOrdinal(Number(item?.toDate))}
                    </Badge>
                  </Group>
                ) : item?.createdAt ? (
                  formatTimestampWithOrdinal(Number(item?.createdAt))
                ) : (
                  'N/A'
                )}
              </Table.Td>
              {showRental && <Table.Td>${rowTotal}</Table.Td>}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
