const { Metaplex } = require("@metaplex-foundation/js");
const { Connection, PublicKey } = require("@solana/web3.js");
const { publicKey, u64, bool } = require("@solana/buffer-layout-utils");
const { u32, u8, struct } = require("@solana/buffer-layout");
const {
  deserializeMetadata,
} = require("@metaplex-foundation/mpl-token-metadata");

const SOLANA_CONNECTION = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371"
);
const MINT_ADDRESS = new PublicKey(
  "AFfbA8JV3XLfLop3yHaY6WLybmZ2a2WtiFsxTWq9pump"
);
const metaplex = Metaplex.make(SOLANA_CONNECTION);

// name: [65, (0, serializers_1.string)()],
// symbol: [null, (0, serializers_1.string)()],
// uri: [null, (0, serializers_1.string)()],

const fetchAndParseMint = async (mint, solanaConnection) => {
  try {
    console.log(`Step - 1: Fetching Account Data for ${mint.toBase58()}`);
    const metadataAccount = metaplex.nfts().pdas().metadata({ mint: mint });
    let acc = (await solanaConnection.getAccountInfo(metadataAccount)) || {};
    let { data } = acc;
    if (!data) return;
    console.log({
      publicKey: metadataAccount,
      ...acc,
    });
    const decoded = deserializeMetadata({
      publicKey: metadataAccount,
      ...acc,
    });
    console.log(decoded);

    // console.log(`Step - 2: Deserializing Found Account Data`);
    // const deserialized = MintLayout.decode(data);
    // console.log(deserialized);
  } catch {
    return null;
  }
};

fetchAndParseMint(MINT_ADDRESS, SOLANA_CONNECTION);

// const { Connection, PublicKey } = require("@solana/web3.js");
// const { publicKey, u64, bool } = require("@solana/buffer-layout-utils");
// const { u32, u8, struct } = require("@solana/buffer-layout");

// const SOLANA_CONNECTION = new Connection(
//   "https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371"
// );
// const MINT_ADDRESS = new PublicKey(
//   "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
// );

// const MintLayout = struct([
//   u32("mintAuthorityOption"),
//   publicKey("mintAuthority"),
//   u64("supply"),
//   u8("decimals"),
//   bool("isInitialized"),
//   u32("freezeAuthorityOption"),
//   publicKey("freezeAuthority"),
// ]);

// const fetchAndParseMint = async (mint, solanaConnection) => {
//   try {
//     console.log(`Step - 1: Fetching Account Data for ${mint.toBase58()}`);
//     let { data } = (await solanaConnection.getAccountInfo(mint)) || {};
//     if (!data) return;

//     console.log(`Step - 2: Deserializing Found Account Data`);
//     const deserialized = MintLayout.decode(data);
//     console.log(deserialized);
//   } catch {
//     return null;
//   }
// };

// // export interface RawMint {
// //   mintAuthorityOption: 1 | 0;
// //   mintAuthority: PublicKey;
// //   supply: bigint;
// //   decimals: number;
// //   isInitialized: boolean;
// //   freezeAuthorityOption: 1 | 0;
// //   freezeAuthority: PublicKey;
// // }

// fetchAndParseMint(MINT_ADDRESS, SOLANA_CONNECTION);
