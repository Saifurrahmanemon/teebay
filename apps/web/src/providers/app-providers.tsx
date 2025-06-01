import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { BrowserRouter } from "react-router-dom";
import { client } from "../api/client";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MantineProvider>
          <ModalsProvider>
            <Notifications position="top-right" />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}
