import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

function makeQueryClientInstance() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function makeQueryClient() {
  if (isServer) {
    return makeQueryClientInstance();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClientInstance();
  }
  return browserQueryClient;
}
