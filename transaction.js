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
const SOLANA_PROGRAM_ID = {
  RAYDIUM: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];

const getTransaction = async (signature) => {
  console.log('start getting transaction: ', signature);
  const tx = await connection.getTokenAccountsByOwner(signature, {
    maxSupportedTransactionVersion: 0,
  });
  console.log('Transaction: ', tx);
  // Traverse transaction instructions
  tx?.transaction.message.instructions.forEach((instruction) => {
    if (
      instruction?.programId &&
      instruction.programId.toBase58() === RAYDIUM_MINT_ADDRESS
    ) {
      const accounts = instruction.accounts;
      console.log("LP address: ", accounts[4]);
      console.log("token A address: ", accounts[8]);
      console.log("token B address: ", accounts[9]);
    }
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
        mentions: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
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
        console.log("New Raydium pair created:", log);
        getTransaction(log.value.signature);
      }
      console.log("New transaction log:", log);
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
  return log.value.logs.some((entry) =>
    entry.includes("InitializeInstruction2")
  ); // Placeholder logic
}

/*
New Raydium pair created: {
  context: { slot: 278238184 },
  value: {
    signature: '2oJJbLGB9hNfejMYBw7FuTfd3Bi3ZpkiqCYkTUyJwTsUe3T6F5Cx7VuP1dp74JNVV2Fo9n2F45dF51qZri5yLnqW',
    err: null,
    logs: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
      'Program log: Instruction: InitializeAccount',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3443 of 299550 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8 invoke [1]',
      'Program log: initialize2: InitializeInstruction2 { nonce: 254, open_time: 1721299881, init_pc_amount: 740000000000, init_coin_amount: 9100000000000000000 }', 
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: SyncNative',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3045 of 278663 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeMint',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2920 of 250973 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeAccount',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4475 of 234971 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeAccount',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3445 of 217395 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX invoke [2]',
      'Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX consumed 2319 of 191894 compute units',
      'Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX success',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]',
      'Program log: Create',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
      'Program log: Instruction: GetAccountDataSize',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1595 of 178031 compute units',
      'Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Initialize the associated token account',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
      'Program log: Instruction: InitializeImmutableOwner',
      'Program log: Please upgrade to SPL Token 2022 for immutable owner support',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 171418 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
      'Program log: Instruction: InitializeAccount3',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 167536 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 20389 of 183428 compute units',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: Transfer',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 160051 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: Transfer',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4736 of 152448 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: MintTo',
      ... 9 more items
    ]
  }
}
  */
