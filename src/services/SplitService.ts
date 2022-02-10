import { Contract } from '@ethersproject/contracts'
import { MERGE_SPLIT_URL, NFT_ELF_STATION_ADDRESS } from '../constants';
import nftElfStationAbi from '../constants/abis/nftelfstation.json';
import { Web3Provider } from '@ethersproject/providers'

export class SplitService{

    public contract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_ELF_STATION_ADDRESS, nftElfStationAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async split(tokenId:string){
        try{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    { 
                        tokenId: tokenId
                    }
                )
            };
            
            // split
            let result = await fetch(`${MERGE_SPLIT_URL+'api/split'}`, requestOptions);
            let res = await result.json();
            if(res.status === 200){
                console.log("Split success ", res);
                return await this.contract.split(res.metadataHash, res.tokenTraits, res.edition, res.tokenId);
            }
            return null;
        } catch(e){
            return null;
        }
    }
}