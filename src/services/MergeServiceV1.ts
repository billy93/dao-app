import { Contract } from '@ethersproject/contracts'
import { MERGE_SPLIT_URL, NFT_ADDRESS } from '../constants';
import nftAbi from '../constants/abis/nft.json';
import { Web3Provider } from '@ethersproject/providers'

export class MergeServiceV1{

    public contract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_ADDRESS, nftAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async merge(tokenIds: string[]){
        try{
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    { 
                        tokenId: tokenIds 
                    }
                )
            };
            
            // create art on the fly
            let result = await fetch(`${MERGE_SPLIT_URL+'api/merge'}`, requestOptions);
            let res = await result.json();
            if(res.status === 200){
                console.log("Do Merge with filename : ", res.filename);
                console.log("Do Merge with image hash : ", res.imageHash);
                console.log("Do Merge with json hash : ", res.jsonHash);
                console.log("Do Merge with edition : ", res.edition);
                console.log("Do Merge with tokenId : ", res.tokenIds);
                return await this.contract.merge(res.filename, res.jsonHash, res.edition, tokenIds);
            }
            return null;
        } catch(e){
            return null;
        }
    }
}