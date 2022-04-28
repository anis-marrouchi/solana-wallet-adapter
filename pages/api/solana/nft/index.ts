import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import {
  getParsedNftAccountsByOwner, resolveToWalletAddress, getSolanaMetadataAddress
} from "@nfteyez/sol-rayz";

const secret = process.env.NEXTAUTH_SECRET

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
  const base58 = req.body.base58.toString();

  const publicAddress = await resolveToWalletAddress({
    text: base58,
  });
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress,
  });
  
  res.send(nfts);
} else {
  // Handle any other HTTP method
  res.status(200).json('ok');
}
}