import { ApolloProvider } from '@apollo/client/react'
import { ReactNode } from 'react';

import { apolloClient } from './client';

type Props = {
  children: ReactNode;
};

export function GraphQLProvider({
  children,
}: Props) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}