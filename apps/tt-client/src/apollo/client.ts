import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useServerStatusStore } from '@/store/serverStatusStore';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    const errorMsg =
      'Server is down. Our sports gateway is currently unreachable. Please check your connection or retry shortly.';
    useServerStatusStore.getState().setServerDown(true, errorMsg);
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const msg = err.message || '';
      if (
        msg.includes('ECONNREFUSED') ||
        msg.includes('Mongo') ||
        msg.includes('Database') ||
        msg.includes('connect ECONNREFUSED')
      ) {
        useServerStatusStore
          .getState()
          .setServerDown(
            true,
            'Server is down. Our sports database is temporarily unavailable. We are attempting to reconnect.'
          );
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});