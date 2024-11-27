const solanaWeb3 = require("@solana/web3.js");

async function getTransactionDetails(connection, signature) {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: "confirmed",
    });
    if (transaction) {
      // Check if the transaction involves creating a new pair
      for (const instruction of transaction.transaction.message.instructions) {
        const parsedInstruction =
          solanaWeb3.SystemInstruction.decodeInstructionType(instruction);

        if (parsedInstruction === "CreateAccount") {
          // Assuming the instruction to create a new pair is detected here
          const decodedInstruction =
            solanaWeb3.SystemInstruction.decodeCreateAccount(instruction);
          const mintToken = decodedInstruction.fromPubkey.toBase58();
          const quoteToken = decodedInstruction.toPubkey.toBase58();

          console.log("Mint Token:", mintToken);
          console.log("Quote Token:", quoteToken);

          // Return or process the mint and quote token pair as needed
          return { mintToken, quoteToken };
        }
      }
    } else {
      console.log("Transaction not found");
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
  }
}

(async () => {
  // Connect to the Solana cluster
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  // Transaction signature (example)
  const signature = "2SzQmQKBvCbxQnKcL48ATpDmQmzokUU3EDaWHsUrtjhNNjovbUaR6vmBTgGq4i7RDaE57YdhT5sVrHbidisbzsoK";

  // Get transaction details
  await getTransactionDetails(connection, signature);
})();
