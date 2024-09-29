import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DAOModule = buildModule("DAOModule", (m) => {
  const token = m.getParameter("token");
  const pricePerShare = m.getParameter("pricePerShare");

  const dao = m.contract("DAO", [token, pricePerShare]);

  return { dao };
});

export default DAOModule;
