import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { NFT_REINDEER_STAKING_ADDRESS } from '../constants';
import nftStakingAbi from '../constants/abis/nftStakingAbi.json';

export class StakingService{
    private contract: Contract;

    constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_REINDEER_STAKING_ADDRESS, nftStakingAbi, signer);
    }

    public async stake(tokenId: string){
        return await this.contract.stake(tokenId);
    }

    public async unstake(tokenId: string){
        return await this.contract.unstake(tokenId);
    }

}