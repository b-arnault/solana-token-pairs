const { getAccount } = require("@solana/spl-token");
const { Connection, PublicKey } = require("@solana/web3.js");

const rpcUrl =
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const RAYDIUM_MINT_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const PUMP_MINT_ADDRESS = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey(RAYDIUM_MINT_ADDRESS),
  PUMP: new PublicKey(PUMP_MINT_ADDRESS),
};

const initialConnection = () => {
  const connection = new Connection(rpcUrl, "confirmed");
  return connection;
};

const getTransaction = async (connection, signature) => {
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });
  return tx;
};

const getTokenAccountInfo = async (
  connection,
  tokenMintAddress,
  ownerAddress
) => {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerAddress, {
    mint: tokenMintAddress,
  });

  if (tokenAccounts.value.length === 0) {
    console.log("No token accounts found for the specified mint and owner.");
    // throw new Error(
    //   "No token accounts found for the specified mint and owner."
    // );
  }

  const tokenAccountAddress = tokenAccounts.value[0].pubkey;
  const tokenAccount = await getAccount(connection, tokenAccountAddress);
  return tokenAccount;
};

// export const getLiquidityPoolInfo = async () => {
//   try {
//     const solTokenAccount = await getTokenAccountInfo(
//       SOL_TOKEN_MINT_ADDRESS,
//       LIQUIDITY_POOL_ADDRESS
//     );
//     const usdcTokenAccount = await getTokenAccountInfo(
//       USDC_TOKEN_MINT_ADDRESS,
//       LIQUIDITY_POOL_ADDRESS
//     );

//     console.log("Liquidity Pool Information:");
//     console.log(`SOL Token Amount: ${solTokenAccount.amount}`);
//     console.log(`USDC Token Amount: ${usdcTokenAccount.amount}`);
//   } catch (error) {
//     console.error("Error fetching liquidity pool information:", error);
//   }
// };

module.exports = {
  rpcUrl,
  RAYDIUM_MINT_ADDRESS,
  PUMP_MINT_ADDRESS,
  SOLANA_PROGRAM_ID,
  initialConnection,
  getTransaction,
  getTokenAccountInfo,
};
