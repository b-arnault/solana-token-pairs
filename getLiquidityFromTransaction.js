import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { getLiquidity } from "@solana/spl-token-liquidity";
const connection = new Connection(clusterApiUrl("devnet"));
const keypair = Keypair.generate();
const transactionId = "your_transaction_id_here"; // Replace with the transaction ID
const tokenMint = "your_token_mint_here"; // Replace with the token mint address
async function getLiquidityFromTransaction() {
  try {
    const liquidity = await getLiquidity(connection, transactionId, tokenMint);
    console.log(liquidity);
  } catch (error) {
    console.error(error);
  }
}
getLiquidityFromTransaction();
