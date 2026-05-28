import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});
console.log(import.meta.env.VITE_API_URL)
const authLink = setContext((_, { headers }) => {
  const token =
    localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token
        ? `Bearer ${token}`
        : '',
    },
  };
});

export const apolloClient =
  new ApolloClient({
    link: authLink.concat(httpLink),

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