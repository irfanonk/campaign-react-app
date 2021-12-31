import web3 from "./web3";
import Token from "../build/Token.json";
export default (address) => {
  return new web3.eth.Contract(Token.abi, address);
};
