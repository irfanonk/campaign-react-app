import web3 from "./web3";
import CampaignFactory from "../build/CampaignFactory.json";
const instance = await new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  process.env.NEXT_PUBLIC_FACTORY_ADDRESS
  //   '0x59915F7324b9DAD4433CbB974fadA7a87CF113eC'
);
export default instance;
