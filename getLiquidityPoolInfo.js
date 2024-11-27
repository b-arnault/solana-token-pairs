const axios = require("axios");
const { getAccount } = require("@solana/spl-token");
const { Connection, PublicKey } = require("@solana/web3.js");
const { LIQUIDITY_STATE_LAYOUT_V4 } = require("@raydium-io/raydium-sdk");
const { OpenOrders } = require("@project-serum/serum");

const rpcUrl =
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const RAYDIUM_MINT_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const PUMP_MINT_ADDRESS = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const OPENBOOK_MINT_ADDRESS = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX";

const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey(RAYDIUM_MINT_ADDRESS),
  PUMP: new PublicKey(PUMP_MINT_ADDRESS),
  OPENBOOK: new PublicKey(OPENBOOK_MINT_ADDRESS),
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
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    {
      mint: tokenMintAddress,
    }
  );

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

//Fetch token prices in USD using Jup pricing APIs
async function getTokenPrices(base, quote) {
  const priceResponse = (
    await axios.get(`https://price.jup.ag/v4/price?ids=${base},${quote}`)
  ).data;
  console.log(`https://price.jup.ag/v4/price?ids=${base},${quote}`);
  return {
    basePrice: priceResponse.data[base]?.price || 0,
    quotePrice: priceResponse.data[quote]?.price || 0,
  };
}

async function getLPInfo() {
  const connection = initialConnection();

  // const parsedAccount = await connection.getParsedAccountInfo(
  //   new PublicKey("8RB7wGfwJLNfuBRp6q7BRcb2a38e9GWhjkQsFZGUM5nh")
  // );

  // console.log(parsedAccount.value.data);

  const acc = await connection.getParsedAccountInfo(
    new PublicKey("A2PiuRwF5U87tZYnkXuE3fvZeskNfeER5jHsJsv3K3pM")
  );
  const parsed = LIQUIDITY_STATE_LAYOUT_V4.decode(acc.value.data);
  const openOrders = await OpenOrders.load(
    connection,
    new PublicKey(parsed.openOrders),
    SOLANA_PROGRAM_ID["OPENBOOK"]
  );
  // console.log(parsed);

  const baseDecimal = 10 ** parsed.baseDecimal; // e.g. 10 ^ 6
  const quoteDecimal = 10 ** parsed.quoteDecimal;

  const baseTokenAmount = await connection.getTokenAccountBalance(
    parsed.baseVault
  );
  const quoteTokenAmount = await connection.getTokenAccountBalance(
    parsed.quoteVault
  );

  const basePnl = parsed.baseNeedTakePnl / baseDecimal;
  const quotePnl = parsed.quoteNeedTakePnl / quoteDecimal;

  const openOrdersBaseTokenTotal = openOrders.baseTokenTotal / baseDecimal;
  const openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal / quoteDecimal;

  const base =
    (baseTokenAmount.value?.uiAmount || 0) + openOrdersBaseTokenTotal - basePnl;
  const quote =
    (quoteTokenAmount.value?.uiAmount || 0) +
    openOrdersQuoteTokenTotal -
    quotePnl;

  const priceInfo = await getTokenPrices(parsed.baseMint, parsed.quoteMint);

  const baseLiquidity = base * priceInfo.basePrice;
  const quoteLiquidity = quote * priceInfo.quotePrice;
  console.log(`Base Token liquidity: ${baseLiquidity} \n`);
  console.log(`Quote Token liquidity: ${quoteLiquidity} \n`);
  console.log(`Total liquidity in the pool: ${baseLiquidity + quoteLiquidity}`);

  // console.log(parsed);

  // const lpMint = parsed.lpMint;
  // let lpReserve = parsed.lpReserve;

  // const accInfo = await connection.getParsedAccountInfo(new PublicKey(lpMint));
  // const mintInfo = accInfo?.value?.data?.parsed?.info;

  // lpReserve = lpReserve / Math.pow(10, mintInfo?.decimals);
  // const actualSupply = mintInfo?.supply / Math.pow(10, mintInfo?.decimals);
  // console.log(
  //   `lpMint: ${lpMint}, Reserve: ${lpReserve}, Actual Supply: ${actualSupply}`
  // );

  // //Calculate burn percentage
  // const maxLpSupply = Math.max(actualSupply, lpReserve - 1);
  // const burnAmt = lpReserve - actualSupply;
  // console.log(`burn amt: ${burnAmt}`);
  // const burnPct = (burnAmt / lpReserve) * 100;
  // console.log(`${burnPct} LP burned`);

  // console.log(lpMint);
  // console.log(lpReserve);
}

getLPInfo();

// async function startConnection(connection: Connection, programAddress: PublicKey, searchInstruction: string): Promise<void> {
//   console.log("Monitoring logs for program:", programAddress.toString());
//   connection.onLogs(
//       programAddress,
//       ({ logs, err, signature }) => {
//           if (err) return;

//           if (logs && logs.some(log => log.includes(searchInstruction))) {
//               console.log("Signature for 'initialize2':", `https://explorer.solana.com/tx/${signature}`);
//               fetchRaydiumMints(signature, connection);
//           }
//       },
//       "finalized"
//   );
// }

// async function fetchRaydiumMints(txId: string, connection: Connection) {
//   try {
//       const tx = await connection.getParsedTransaction(
//           txId,
//           {
//               maxSupportedTransactionVersion: 0,
//               commitment: 'confirmed'
//           });

//       //@ts-ignore
//       const accounts = (tx?.transaction.message.instructions).find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts as PublicKey[];

//       if (!accounts) {
//           console.log("No accounts found in the transaction.");
//           return;
//       }

//       const tokenAIndex = 8;
//       const tokenBIndex = 9;

//       const tokenAAccount = accounts[tokenAIndex];
//       const tokenBAccount = accounts[tokenBIndex];

//       const displayData = [
//           { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
//           { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
//       ];

//       console.log("New LP Found");
//       console.table(displayData);

//   } catch {
//       console.log("Error fetching transaction:", txId);
//       return;
//   }
// }
