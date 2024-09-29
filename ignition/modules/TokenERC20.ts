import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenERC20Module = buildModule("TokenERC20Module", (m) => {
  const name = m.getParameter("name");
  const symbol = m.getParameter("symbol");
  const initialSupply = m.getParameter("initialSupply");

  const tokenERC20 = m.contract("TokenERC20", [name, symbol, initialSupply]);

  return { tokenERC20 };
});

export default TokenERC20Module;
