import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const rpcUrl =
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const connection = new Connection(rpcUrl, "confirmed");

// Replace with the program ID for the token swap program you're interested in
const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];

// Function to fetch transactions involving the token swap program
async function fetchNewTokenPairs() {
  const recentBlockhash = await connection.getRecentBlockhash();
  const confirmedSignatures = await connection.getSignaturesForAddress(
    TOKEN_SWAP_PROGRAM_ID,
    { limit: 10 }
  );

  for (const { signature } of confirmedSignatures) {
    const transaction = await connection.getTransaction(signature);

    if (transaction) {
      console.log("Transaction signature:", signature);
      console.log("Transaction details:", transaction);

      // Parse the transaction to identify newly created token pairs
      // You might need to decode instructions and look for specific events
      transaction.transaction.message.instructions.forEach((instruction) => {
        // Decode and handle the instruction here
        console.log("Instruction:", instruction);
      });
    }
  }
}

fetchNewTokenPairs().catch((err) => {
  console.error("Error fetching token pairs:", err);
});
