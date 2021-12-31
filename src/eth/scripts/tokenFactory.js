import web3 from "./web3";
import TokenFactory from "../build/TokenFactory.json";
const instance = await new web3.eth.Contract(
  TokenFactory.abi,
  process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS
);
export default instance;
