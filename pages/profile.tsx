import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import * as web3 from '@solana/web3.js';
import { useWallet } from "@solana/wallet-adapter-react";

import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import _ from 'lodash';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from "@mui/material";


export default function ProfilePage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [content, setContent] = useState()
  const [nfts, setNfts] = useState([])
  const { publicKey, wallet, connect, connecting, disconnect } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const walletContent = useMemo(() => {
        if (!wallet || !base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [ wallet, base58]);
  // Fetch content from profile route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/protected/profile");
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    fetchData()
  }, [session])

  useEffect(() => {
    if (!wallet || !base58) return;
    const getNfts = async () => {
      await fetchNfts();
    }
    getNfts();
  }, [wallet, base58]);
  
  const fetchNfts = async () => {
    const res = await fetch(`/api/solana/nft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base58
    })
  });
  const data = await res.json();
    let nftsArray = [];
    for (let i = 0; i < data.length; i++) {
      const nft = await fetch(data[i].data.uri);
      const nftData = await nft.json();
      nftsArray.push(nftData);
    }
    console.log(nftsArray);
    setNfts(nftsArray);
  }

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>My NFT's gallery</h1>
      {/* <pre>
      for inspecting the data structure and available fields, comment out the following line:
        {JSON.stringify(nfts, null, 2)}
      </pre> */}
      { nfts && nfts.length > 0 && <Grid container spacing={2}>
      { nfts.map((nft: any) => {
        return (
          <Grid item xs={4}>
        <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={nft.image}
          alt={nft.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {nft.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nft.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Buy</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
      </Grid>)
      })}
      </Grid>}
    </Layout>
  )
}
