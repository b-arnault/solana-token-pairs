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
const RAYDIUM_MINT_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const SOLANA_PROGRAM_ID = {
    RAYDIUM: new web3_js_1.PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
};
const TOKEN_SWAP_PROGRAM_ID = SOLANA_PROGRAM_ID["RAYDIUM"];
// Extract liquidity information
function extractLiquidityInfo(parsedTransactions) {
    const liquidityInfo = parsedTransactions.map((tx) => {
        let mint = null;
        let quoteAsset = null;
        let lpToken = null;
        // Traverse transaction instructions
        tx === null || tx === void 0 ? void 0 : tx.transaction.message.instructions.forEach((instruction, index) => {
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
            txSignature: tx === null || tx === void 0 ? void 0 : tx.transaction.signatures[0],
            mint,
            quoteAsset,
            lpToken,
        };
    });
    return liquidityInfo;
}
// Function to fetch transactions involving the token swap program
function fetchNewTokenPairs() {
    return __awaiter(this, void 0, void 0, function* () {
        const confirmedSignatures = yield connection.getSignaturesForAddress(TOKEN_SWAP_PROGRAM_ID, { limit: 1000 });
        // console.log(confirmedSignatures);
        const transactions = yield connection.getParsedTransactions(confirmedSignatures.map((item) => item.signature), {
            maxSupportedTransactionVersion: 0,
        });
        extractLiquidityInfo(transactions);
        // console.log();
    });
}
// fetchNewTokenPairs().catch((err) => {
//   console.error("Error fetching token pairs:", err);
// });
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield connection.getParsedTransaction("2oJJbLGB9hNfejMYBw7FuTfd3Bi3ZpkiqCYkTUyJwTsUe3T6F5Cx7VuP1dp74JNVV2Fo9n2F45dF51qZri5yLnqW", {
            maxSupportedTransactionVersion: 0,
        });
        // Traverse transaction instructions
        tx === null || tx === void 0 ? void 0 : tx.transaction.message.instructions.forEach((instruction) => {
            if ((instruction === null || instruction === void 0 ? void 0 : instruction.programId) &&
                instruction.programId.toBase58() === RAYDIUM_MINT_ADDRESS) {
                const accounts = instruction.accounts;
                console.log("LP address: ", accounts[4]);
                console.log("token A address: ", accounts[8]);
                console.log("token B address: ", accounts[9]);
            }
        });
        // console.log(tx?.transaction.message.instructions);
    });
}
test();
