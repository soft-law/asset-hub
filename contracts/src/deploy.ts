import { ethers, Interface, BytesLike } from "ethers";
import path from "path";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

// based on https://github.com/paritytech/contracts-boilerplate/tree/e86ffe91f7117faf21378395686665856c605132/ethers/tools
console.log("ACCOUNT_SEED:", process.env.ACCOUNT_SEED);
console.log("RPC_URL:", process.env.RPC_URL);

const privateKey = process.env.ACCOUNT_SEED;
const rpcUrl = process.env.RPC_URL;

if (!process.env.ACCOUNT_SEED) {
  console.error(
    "ACCOUNT_SEED environment variable is required for deploying smart contract"
  );
  process.exit(1);
}

if (!process.env.RPC_URL) {
  console.error(
    "RPC_URL environment variable is required for deploying smart contract"
  );
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey as string, provider);

console.log("\n=== DEPLOYMENT INFO ===");
console.log("\nDeploying with address:", wallet.address);
console.log("Connected to RPC:", rpcUrl);

const buildDir = ".build";
const contractsOutDir = path.join(buildDir, "contracts");
const deploysDir = path.join(".deploys", "deployed-contracts");
mkdirSync(deploysDir, { recursive: true });

const contracts = readdirSync(contractsOutDir).filter((f) =>
  f.endsWith(".json")
);

type Contract = {
  abi: Interface;
  bytecode: BytesLike;
};

(async () => {
  const contractName = "Softlaw";
  const contract = contracts.find((file) => file.startsWith(contractName));

  if (contract) {
    const name = path.basename(contract, ".json");
    const contractData = JSON.parse(
      readFileSync(path.join(contractsOutDir, contract), "utf8")
    ) as Contract;
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.bytecode,
      wallet
    );

    console.log(`Deploying contract ${name}...`);
    const deployedContract = await factory.deploy();
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();

    console.log(`Deployed contract ${name}: ${address}`);

    const fileContent = JSON.stringify({
      name,
      address,
      abi: contractData.abi,
      deployedAt: Date.now(),
    });
    writeFileSync(path.join(deploysDir, `${address}.json`), fileContent);
  } else {
    console.log(`Contract ${contractName} not found.`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
