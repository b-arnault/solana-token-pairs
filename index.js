"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371";
const connection = new web3_js_1.Connection(rpcUrl, "confirmed");
// Replace with the program ID for the token swap program you're interested in
const SOLANA_PROGRAM_ID = {
    RAYDIUM: new web3_js_1.PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];
// Function to fetch transactions involving the token swap program
function fetchNewTokenPairs() {
    return __awaiter(this, void 0, void 0, function* () {
        const recentBlockhash = yield connection.getRecentBlockhash();
        const confirmedSignatures = yield connection.getSignaturesForAddress(TOKEN_SWAP_PROGRAM_ID, { limit: 10 });
        for (const { signature } of confirmedSignatures) {
            const transaction = yield connection.getTransaction(signature);
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
    });
}
fetchNewTokenPairs().catch((err) => {
    console.error("Error fetching token pairs:", err);
});
