import { Contract } from '@ethersproject/contracts'
import { COLLECTION_HASH, GATEWAY_URL, MERGE_SPLIT_URL, NFT_ADDRESS, NFT_ELF_STATION_ADDRESS, NFT_REINDEER_STAKING_ADDRESS, OWNER_COLLECTION_HASH } from '../constants';
import nftAbi from '../constants/abis/nft.json';
import { Web3Provider } from '@ethersproject/providers'
import { NFT } from '../dtos/NFT';
import unreveal from "../assets/images/unreveal.png";

export class NFTTokenService {
    public contract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(NFT_ADDRESS, nftAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async getBalance(account: string) {
        return await this.contract.balanceOf(account)
    }

    public async lastTokenId() {
        return await this.contract.lastTokenId();
    }

    public async maxSupply(){
        return await this.contract.maxSupply();
    }
    
    public async setApprovalForAllElfStation(){
        return await this.contract.setApprovalForAll(NFT_ELF_STATION_ADDRESS, true);
    }

    public async setApprovalForAllStake(){
        return await this.contract.setApprovalForAll(NFT_REINDEER_STAKING_ADDRESS, true);
    }

    public async isApprovedForAllElfStation(){
        return await this.contract.isApprovedForAll(this.account, NFT_ELF_STATION_ADDRESS);
    }

    public async isApprovedForAllStake(){
        return await this.contract.isApprovedForAll(this.account, NFT_REINDEER_STAKING_ADDRESS);
    }
    

    public async getNftById(tokenIds: string[]){
        let promises: any = [];
        const maxSupply = await this.contract.maxSupply();
        for(let x=0;x<tokenIds.length; x++){
            let tokenId = tokenIds[x];
            let promise = new Promise<NFT>((resolve, reject) => {            
                if(parseInt(tokenId) > parseInt(maxSupply.toString())){
                    this.contract.tokenURI(tokenId).then(function(res:string) {
                        const url = res.substring(7, res.length);
                        fetch(GATEWAY_URL+url)
                        .then(response => {
                            response.json().then(function(resp) {
                                let imageUrl = resp.image.substring(7, resp.image.length);
                                let fullImageUrl = GATEWAY_URL+imageUrl;
                                let mergedMetadata: NFT[] | [] = [];

                                if(resp.mergedMetadata){
                                    mergedMetadata = new Array();
                                    for(var x=0;x<resp.mergedMetadata.length;x++){
                                        let oldData = resp.mergedMetadata[x];
                                        mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                    }
                                }
                                resolve(new NFT(tokenId, fullImageUrl, resp.name, resp.attributes[7].value, mergedMetadata));
                            });
                        }) 
                        .catch(err => {
                            resolve(new NFT("", "", "", "", []));
                        })
                    });
                }
                else{
                    fetch(GATEWAY_URL+COLLECTION_HASH+'/'+tokenId+'.json')
                    .then(response => {
                        response.json().then(function(resp) {
                            let imageUrl = resp.image.substring(7, resp.image.length);
                            let fullImageUrl = GATEWAY_URL+imageUrl;                            
                            
                            let mergedMetadata: NFT[] | [] = [];

                            if(resp.mergedMetadata){
                                mergedMetadata = new Array();
                                for(var x=0;x<resp.mergedMetadata.length;x++){
                                    let oldData = resp.mergedMetadata[x];
                                    mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                }
                            }

                            resolve(new NFT(tokenId, fullImageUrl, resp.name, resp.attributes[7].value, mergedMetadata));
                        });
                    })
                    .catch(err => {
                        resolve(new NFT("", "", "", "", []));
                    })
                }
            });
            promises.push(promise);
        }
        return Promise.all<NFT>(promises);
    }

    public async getWalletOfOwner(account: string) : Promise<NFT[]>{
        const walletOfOwner = await this.contract.walletOfOwner(account);
        const maxSupply = await this.contract.maxSupply();
        const reveal = await this.isRevealed();

        let promises: any = [];
        for(let x=0;x<walletOfOwner.length; x++){
            let promise = new Promise<NFT>((resolve, reject) => {
                let tokenId = walletOfOwner[x].toString();
                
                if(reveal){
                    if(parseInt(tokenId) > parseInt(maxSupply.toString())){
                        this.contract.tokenURI(tokenId).then(function(res:string) {
                            const url = res.substring(7, res.length);
                            fetch(GATEWAY_URL+url)
                            .then(response => {
                                response.json().then(function(resp) {
                                    let imageUrl = resp.image.substring(7, resp.image.length);
                                    let fullImageUrl = GATEWAY_URL+imageUrl;
                                    let mergedMetadata: NFT[] | [] = [];
    
                                    if(resp.mergedMetadata){
                                        mergedMetadata = new Array();
                                        for(var x=0;x<resp.mergedMetadata.length;x++){
                                            let oldData = resp.mergedMetadata[x];
                                            mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                        }
                                    }
                                    resolve(new NFT(tokenId, fullImageUrl, resp.name, resp.attributes[7].value, mergedMetadata));
                                });
                            }) 
                            .catch(err => {
                                resolve(new NFT("", "", "", "", []));
                            })
                        });
                    }
                    else{
                        let collectionHash = COLLECTION_HASH;
                        if(parseInt(tokenId) <= 4){
                            collectionHash = OWNER_COLLECTION_HASH;
                        }
                        fetch(GATEWAY_URL+collectionHash+'/'+tokenId+'.json')
                        .then(response => {
                            response.json().then(function(resp) {
                                let imageUrl = resp.image.substring(7, resp.image.length);
                                let fullImageUrl = GATEWAY_URL+imageUrl;                            
                                
                                let mergedMetadata: NFT[] | [] = [];
    
                                if(resp.mergedMetadata){
                                    mergedMetadata = new Array();
                                    for(var x=0;x<resp.mergedMetadata.length;x++){
                                        let oldData = resp.mergedMetadata[x];
                                        mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                    }
                                }
    
                                resolve(new NFT(tokenId, fullImageUrl, resp.name, parseInt(tokenId) > 4 ? resp.attributes[7].value : "", mergedMetadata));
                            });
                        })
                        .catch(err => {
                            resolve(new NFT("", "", "", "", []));
                        })
                    }
                }
                else{
                    resolve(new NFT(tokenId, unreveal, "", "", []));
                }

            });
            promises.push(promise);
        }
        return Promise.all<NFT>(promises);
    }

    public async getBingoMyNft(account: string) : Promise<NFT[]>{
        const walletOfOwner = await this.contract.walletOfOwner(account);
        const maxSupply = await this.contract.maxSupply();

        let promises: any = [];
        for(let x=0;x<walletOfOwner.length; x++){
            let promise = new Promise<NFT | null>((resolve, reject) => {
                let tokenId = walletOfOwner[x].toString();
                
                if(parseInt(tokenId) > parseInt(maxSupply.toString())){
                    this.contract.tokenURI(tokenId).then(function(res:string) {
                        const url = res.substring(7, res.length);
                        fetch(GATEWAY_URL+url)
                        .then(response => {
                            response.json().then(function(resp) {
                                let imageUrl = resp.image.substring(7, resp.image.length);
                                let fullImageUrl = GATEWAY_URL+imageUrl;
                                let mergedMetadata: NFT[] | [] = [];

                                if(resp.mergedMetadata){
                                    mergedMetadata = new Array();
                                    if(resp.mergedMetadata.length == 12){
                                        for(var x=0;x<resp.mergedMetadata.length;x++){
                                            let oldData = resp.mergedMetadata[x];
                                            mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                        }
                                        resolve(new NFT(tokenId, fullImageUrl, resp.name, resp.attributes[7].value, mergedMetadata));
                                    }
                                    else{
                                        resolve(null)
                                    }
                                }
                            });
                        }) 
                        .catch(err => {
                            resolve(null);
                        })
                    });
                }
            });
            promises.push(promise);
        }
        return Promise.all<NFT>(promises);
    }


    public async getMergedNft(account: string) : Promise<NFT[]>{
        const walletOfOwner = await this.contract.walletOfOwner(account);
        const maxSupply = await this.contract.maxSupply();

        let promises: any = [];
        for(let x=0;x<walletOfOwner.length; x++){
            let tokenId = walletOfOwner[x].toString();                
            if(parseInt(tokenId) > parseInt(maxSupply.toString())){
                let promise = new Promise<NFT>((resolve, reject) => {
                    this.contract.tokenURI(tokenId).then(function(res:string) {
                        const url = res.substring(7, res.length);
                        fetch(GATEWAY_URL+url)
                        .then(response => {
                            response.json().then(function(resp) {
                                if(resp.mergedMetadata){
                                    let imageUrl = resp.image.substring(7, resp.image.length);
                                    let fullImageUrl = GATEWAY_URL+imageUrl;

                                    let mergedMetadata: NFT[] | [] = [];

                                    if(resp.mergedMetadata){
                                        mergedMetadata = new Array();
                                        for(var x=0;x<resp.mergedMetadata.length;x++){
                                            let oldData = resp.mergedMetadata[x];
                                            mergedMetadata.push(new NFT(oldData.tokenId, "", oldData.name, oldData.attributes[7].value, []));
                                        }
                                    }
    
                                    resolve(new NFT(tokenId, fullImageUrl, resp.name, resp.attributes[7].value, mergedMetadata));
                                }else{
                                    // console.log("Reject")
                                    resolve(new NFT("", "", "", "", []));
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            resolve(new NFT("", "", "", "", []));
                        })
                    });
                });
                promises.push(promise);
            }
        }
        return Promise.all<NFT>(promises);
    }

    public async getRevealNft(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 
                    address: this.account,
                }
            )
        };
        // create art on the fly
        let result = await fetch(`${MERGE_SPLIT_URL}api/getRevealNft`, requestOptions);
        let res = await result.json();
        if(res.status === 200){
            if(res.data.length > 0){
                return res.data.map((e: NFT) => {
                    return new NFT(e.tokenId, "", "", e.xmasTrait, []);
                });
            }
        }
        
        return [];  
    }

    public async revealNft(tokenId: string){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 
                    address: this.account,
                    tokenId: tokenId
                }
            )
        };
        // create art on the fly
        let result = await fetch(`${MERGE_SPLIT_URL}api/revealNft`, requestOptions);
        let res = await result.json();
        if(res.status === 200){
            return res.data;
        }
    }

    public async getReferralPoint(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 
                    address: this.account,
                }
            )
        };
        let result = await fetch(`${MERGE_SPLIT_URL}api/getReferralPoint`, requestOptions);
        let res = await result.json();
        if(res.status === 200){
            return res.point;
        }
        return 0;
    }

    public async allowMint(){
        let lastTokenId = await this.lastTokenId();
        let maxSupply = await this.maxSupply();

        if(parseInt(lastTokenId.toString()) < parseInt(maxSupply.toString())){
            return true;
        }
        return false;
    }

    public async allowMerge(){
        let lastTokenId = await this.lastTokenId();
        let maxSupply = await this.maxSupply();

        if(parseInt(lastTokenId.toString()) >= parseInt(maxSupply.toString())){
            return true;
        }
        return false;
    }

    public async allowSplit(){
        let lastTokenId = await this.lastTokenId();
        let maxSupply = await this.maxSupply();

        if(parseInt(lastTokenId.toString()) >= parseInt(maxSupply.toString())){
            return true;
        }
        return false;
    }

    public async allowStake(){
        let lastTokenId = await this.lastTokenId();
        let maxSupply = await this.maxSupply();

        if(parseInt(lastTokenId.toString()) >= parseInt(maxSupply.toString())){
            return true;
        }
        return false;
    }

    public async isRevealed(){
        return await this.contract.revealed();
    }
}