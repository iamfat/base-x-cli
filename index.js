#!/usr/bin/env node
const minimist = require("minimist");
const os = require("os");

const args = minimist(process.argv.splice(2), {
  alias: {
    b: "base",
    d: "decode",
  },
  string: ["base"],
  boolean: ["decode"],
});

const BASEDICT = {
  "2": "01",
  "8": "01234567",
  "11": "0123456789a",
  "16": "0123456789abcdef",
  "32": "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
  z32: "ybndrfg8ejkmcpqxot1uwisza345h769",
  "36": "0123456789abcdefghijklmnopqrstuvwxyz",
  "58": "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  "62": "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "64": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  "66": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
};

if (!args.base) {
  console.error(
    "Usage: base-x -b|--base 2|8|11|16|32|z32|36|58|62|64|66 [-d|--decode]"
  );
  process.exit(1);
}

const base = BASEDICT[args.base];
if (!base) {
  console.error(`Unrecognized base ${base}!`);
  process.exit(1);
}

const x = require("base-x")(base);

if (process.stdin.isTTY) {
  if (args.decode) {
    process.stdout.write(x.decode(args._[0]));
  } else {
    process.stdout.write(x.encode(Buffer.from(args._[0])));
    if (process.stdout.isTTY) {
      process.stdout.write(os.EOL);
    }
  }
} else {
  let buf = Buffer.alloc(0);
  process.stdin.on("readable", () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
      buf = Buffer.concat([buf, chunk]);
    }
  });

  process.stdin.on("end", () => {
    if (args.decode) {
      process.stdout.write(x.decode(buf.toString("utf8")));
    } else {
      process.stdout.write(x.encode(buf));
      if (process.stdout.isTTY) {
        process.stdout.write(os.EOL);
      }
    }
  });
}
