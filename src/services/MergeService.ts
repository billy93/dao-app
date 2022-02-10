import { Contract } from '@ethersproject/contracts'
import { MERGE_SPLIT_URL, NFT_ELF_STATION_ADDRESS } from '../constants';
import nftElfStationAbi from '../constants/abis/nftelfstation.json';
import { Web3Provider } from '@ethersproject/providers'

export class MergeService{

    public contract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_ELF_STATION_ADDRESS, nftElfStationAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async merge(tokenIds: string[]){
        try{            
            // return await this.contract.merge("13-1ff328b0-5e40-11ec-9a16-9dfa243434d7", "Qmf1D18FX7B69xHfS9JbyfZ4YM5XygXMK28Ym1Abn1hMJJ", 13, tokenIds);

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
                console.log("Do Merge with tokenId : ", tokenIds);
                console.log("Do Merge with traits : ", res.traits);
                return await this.contract.merge(res.filename, res.jsonHash, res.edition, tokenIds, res.traits);
            }
            return null;
        } catch(e){
            return null;
        }
    }
}