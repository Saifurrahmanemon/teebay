import { ApolloProvider } from "@apollo/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { BrowserRouter } from "react-router-dom";
import { client } from "../api/client";
import { AuthProvider } from "@/context/auth-context";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../global.css";

const theme = createTheme({
  primaryColor: "indigo",
  colors: {
    indigo: [
      "#f0f0ff",
      "#d6d6ff",
      "#bfbfff",
      "#9999ff",
      "#807fff",
      "#665aee",
      "#594fcf",
      "#4d44b2",
      "#3d3784",
      "#2c2660",
    ],
  },
  primaryShade: 5,
  fontFamily: "Inter, sans-serif",
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications position="top-right" />

            <AuthProvider>{children}</AuthProvider>
          </ModalsProvider>
        </MantineProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}
