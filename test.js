const { Web3 } = require("@solana/web3.js");
const { deserializeUnchecked } = require("borsh");

const url = `https://mainnet.helius-rpc.com/?api-key=bfddcbfb-a279-4d1a-b021-0590a6623371`;

const tokenAddress = "53YybTQwZB5bP9cnXCDEtxvSSuCXsuq1z99mb3jWpump";

const getAsset = async () => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `get-asset-${tokenAddress}`,
      method: "getAsset",
      params: {
        id: tokenAddress,
        displayOptions: {
          showFungible: true, //return details about a fungible token
        },
      },
    }),
  });
  console.log(response);
  const { result } = await response.json();
  return result;
};
// getAsset().then((result) => {
//   console.log(result);
// });

const test = () => {
  const web3 = new Web3("https://spl_governance.cratus.io:8899");

  const liquidityPoolAddress = "6yfgbn5YZDLBAVybbuuDEUTwU7CdDR8JS2qRHYVs9Ucx";
  const liquidityPoolLayout = [
    { name: "nonce", type: "u8" },
    { name: "tokenA", type: "publicKey" },
    { name: "tokenB", type: "publicKey" },
    { name: "liquidity", type: "u64" },
  ];

  web3
    .getConnection()
    .getAccountInfo(liquidityPoolAddress)
    .then((accountInfo) => {
      const liquidityPoolData = accountInfo.data;
      const decodedData = deserializeUnchecked(
        liquidityPoolLayout,
        liquidityPoolAddress,
        liquidityPoolData
      );
      const liquidity = decodedData.liquidity;
      console.log("Liquidity:", liquidity);
    });
};

test();
