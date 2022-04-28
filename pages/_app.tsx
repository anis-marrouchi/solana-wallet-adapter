import { SessionProvider } from "next-auth/react"
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../components/ContextProvider';
import "./styles.css"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
    <Head>
      <title>Solana Wallet Adapter</title>
    </Head>
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <ContextProvider>
      <Component {...pageProps} />
      </ContextProvider>
    </SessionProvider>
    </>
  )
}

export default App;
