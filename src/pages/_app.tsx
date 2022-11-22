import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../styles/globals.css'
import awsExports from "../aws-exports";
import type { AppProps } from 'next/app'

Amplify.configure({...awsExports, ssr: true });

export default function App(
  {
    Component,
    pageProps,
  }: AppProps,
) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Component {...pageProps} />
      )}
    </Authenticator>
  );
}

/*
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>*/
