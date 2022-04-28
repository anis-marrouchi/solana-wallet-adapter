import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import {
  WalletMultiButton,
// } from './wallet/WalletMultiButton';
} from '@solana/wallet-adapter-material-ui';

import { useWallet } from "@solana/wallet-adapter-react";
import { MouseEventHandler, useCallback, useEffect, useMemo } from "react";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const { publicKey, wallet, connect, connecting, disconnect } = useWallet();
 
  const onConnect: MouseEventHandler<HTMLButtonElement> = useCallback(
      (event) => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          if (!event.defaultPrevented)
              connect().catch(() => {
                  // Silently catch because any errors are caught by the context `onError` handler
              });
      },
      [connect]
  );
  
  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              <span className={styles.signedInText}>
                <small>Hello </small>
                <strong>{session.user.name ?? session.user.email}</strong>
              <WalletMultiButton style={{marginLeft: '12px'}} />
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {session?.user &&<li className={styles.navItem}>
            <Link href="/profile">
              <a>NFTs</a>
            </Link>
          </li>}
        </ul>
      </nav>
    </header>
  )
}
