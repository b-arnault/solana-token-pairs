const {
  Connection,
  ParsedInstruction,
  PublicKey,
  clusterApiUrl,
} = require("@solana/web3.js");
const solanaWeb3 = require("@solana/web3.js");

const rpcUrl =
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const connection = new Connection(rpcUrl, "confirmed");

// Replace with the program ID for the token swap program you're interested in
const RAYDIUM_MINT_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];

// Extract liquidity information
function extractLiquidityInfo(parsedTransactions) {
  const liquidityInfo = parsedTransactions.map((tx) => {
    let mint = null;
    let quoteAsset = null;
    let lpToken = null;

    // Traverse transaction instructions
    tx?.transaction.message.instructions.forEach((instruction, index) => {
      if (instruction.programId.equals(TOKEN_SWAP_PROGRAM_ID)) {
        // Further analyze the instruction data to confirm it's a pair creation instruction
        const data = instruction.data;
        console.log("yes");
        // if (isPairCreationInstruction(data)) {
        //   return true;
        // }
      }
      // if ("parsed" in instruction) {
      //   const parsedInstruction = instruction as ParsedInstruction;
      //   const { type } = parsedInstruction.parsed;
      //   console.log(`Instruction ${index + 1}: Type - ${type}`);
      // }

      // if (
      //   instruction?.programId &&
      //   instruction.programId.toBase58() === RAYDIUM_MINT_ADDRESS
      // ) {
      //   const accounts = instruction.accounts;`
      //   console.log("LP address: ", accounts[4]);
      //   console.log("token A address: ", accounts[8]);
      //   console.log("token B address: ", accounts[9]);
      // }
    });

    return {
      txSignature: tx?.transaction.signatures[0],
      mint,
      quoteAsset,
      lpToken,
    };
  });

  return liquidityInfo;
}

// Function to fetch transactions involving the token swap program
async function fetchNewTokenPairs() {
  const confirmedSignatures = await connection.getSignaturesForAddress(
    TOKEN_SWAP_PROGRAM_ID,
    { limit: 1000 }
  );

  // console.log(confirmedSignatures);

  const transactions = await connection.getParsedTransactions(
    confirmedSignatures.map((item) => item.signature),
    {
      maxSupportedTransactionVersion: 0,
    }
  );
  extractLiquidityInfo(transactions);
  // console.log();
}

// fetchNewTokenPairs().catch((err) => {
//   console.error("Error fetching token pairs:", err);
// });

async function test() {
  const tx = await connection.getParsedTransaction(
    "2AG9ojbLHBP5XvVG5c7FQ1M7K2Qf7tN5zWbHDw29zJZ11ZCksgwMGp7Ca9d4z4XqBbm5nL2bUmvjdH48Q2poRC8g",
    {
      maxSupportedTransactionVersion: 0,
    }
  );
  console.log(tx?.transaction.message.instructions);
  // Traverse transaction instructions
  tx?.transaction.message.instructions.forEach((instruction, index) => {
    if (
      instruction?.programId &&
      instruction.programId.toBase58() ===
        "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
    ) {
      const accounts = instruction.accounts;

      console.log(`LP address ${index}: ${accounts[3].toBase58()}`);
    }
  });
  // console.log(tx?.transaction.message.instructions);
}
