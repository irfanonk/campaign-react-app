import web3 from "./web3";
import DrugAuthenticity from "../build/DrugAuthenticity.json";
const instance = await new web3.eth.Contract(
  DrugAuthenticity.abi,
  process.env.NEXT_PUBLIC_DRUG_AUTHENTICITY_ADDRESS
);
export default instance;
