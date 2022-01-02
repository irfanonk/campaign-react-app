import web3 from "./web3";
import SellToken from "../build/SellToken.json";
export default (address) => {
  return new web3.eth.Contract(SellToken.abi, address);
};
