const {
  Connection,
  ParsedInstruction,
  PublicKey,
  clusterApiUrl,
} = require("@solana/web3.js");
const solanaWeb3 = require("@solana/web3.js");
const WebSocket = require("ws");

const rpcUrl =
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const connection = new Connection(rpcUrl, "confirmed");

// Replace with the program ID for the token swap program you're interested in
const RAYDIUM_MINT_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const PUMP_MINT_ADDRESS = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
  PUMP: new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];

const getTransaction = async (signature) => {
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });
  // Traverse transaction instructions
  console.log("\r\rTransaction: ", signature);
  tx?.transaction.message.instructions.some((instruction, index) => {
    if (
      instruction?.programId &&
      instruction.programId.toBase58() === PUMP_MINT_ADDRESS
    ) {
      const accounts = instruction.accounts;
      // console.log(
      //   "accounts: ",
      //   accounts.map((account) => account.toBase58())
      // );
      console.log(`LP address ${index}: ${accounts[2].toBase58()}`);
      console.log("mint address: ", accounts[0].toBase58());
      // console.log("token B address: ", accounts[9].toBase58());
      return true;
    }
    return false;
  });
  // console.log(tx?.transaction.message.instructions);
};

// Connect to the Solana WebSocket endpoint
// const ws = new WebSocket("wss://api.mainnet-beta.solana.com");
const ws = new WebSocket(
  "ws://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371"
);

ws.on("open", function open() {
  // Subscribe to logs
  const params = {
    jsonrpc: "2.0",
    id: 1,
    method: "logsSubscribe",
    params: [
      {
        mentions: [PUMP_MINT_ADDRESS],
      },
      {
        commitment: "confirmed",
      },
    ],
  };
  ws.send(JSON.stringify(params));
});

ws.on("message", function incoming(data) {
  try {
    const response = JSON.parse(data);
    if (response.method === "logsNotification") {
      const log = response.params.result;
      if (isNewPairCreationLog(log)) {
        // console.log("New Raydium pair created:", log);
        getTransaction(log.value.signature);
      }
      // console.log("New transaction log:", log.value.signature);
      // console.log("New transaction log:", log);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");
});

// Function to determine if a log corresponds to a new pair creation
function isNewPairCreationLog(log) {
  // Implement your logic to identify new pair creation logs
  // This might involve checking for specific instruction data or log messages
  return log.value.logs.some((entry) => entry.includes("InitializeMint2")); // Placeholder logic
}
