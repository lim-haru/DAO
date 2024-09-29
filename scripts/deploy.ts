import hre from "hardhat";
import DAOModule from "../ignition/modules/DAO";
import TokenERC20Module from "../ignition/modules/TokenERC20";
import { parseEther } from "ethers";

async function main() {
  const name = "Token";
  const symbol = "TOK";
  const initialSupply = parseEther("1000000");

  const { tokenERC20 } = await hre.ignition.deploy(TokenERC20Module, {
    parameters: { TokenERC20Module: { name, symbol, initialSupply } },
  });

  const token = tokenERC20.target.toString();
  const pricePerShare = "10";

  const { dao } = await hre.ignition.deploy(DAOModule, {
    parameters: { DAOModule: { token, pricePerShare } },
  });

  console.log(`Token deployed to: ${tokenERC20.target}`);
  console.log(`DAO deployed to: ${dao.target}`);
}

main().catch(console.error);
