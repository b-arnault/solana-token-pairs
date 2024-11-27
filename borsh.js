const borsh = require("borsh");

const value = { x: 255, y: BigInt(20), z: "123", arr: [1, 2, 3] };
const schema = {
  struct: { x: "u8", y: "u64", z: "string", arr: { array: { type: "u8" } } },
};

const encoded = borsh.serialize(schema, value);
console.log(encoded);
const decoded = borsh.deserialize(schema, encoded);
console.log(decoded);
