import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { NFT_ADDRESS } from '../constants';
import nftAbi from '../constants/abis/nft.json';
import { formatEther, parseEther } from "@ethersproject/units";
import { AddressZero } from '@ethersproject/constants'

export class MintService{
    private contract: Contract;
    private account: string;
    // private chainId: number;

    constructor(library: Web3Provider, account: string, chainId: number) {
        this.account = account;
        // this.chainId = chainId;
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_ADDRESS, nftAbi, signer);
    }

    public async mint(amount: number, referralAddress?: any){
        if(await this.contract.owner() == this.account){
            return await this.contract.mint(amount.toString(), referralAddress ?? AddressZero);
        }
        else{
            const cost = await this.contract.cost();
            const totalCost = formatEther((cost * amount).toString());
            const options = {value: parseEther(totalCost.toString())}
            return await this.contract.mint(amount.toString(), referralAddress ?? AddressZero, options);
        }
    }
}