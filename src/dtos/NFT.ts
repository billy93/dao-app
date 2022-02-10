export class NFT {

    public tokenId: string;
    public imageUrl: string;
    public name: string;
    public xmasTrait: string;
    public mergedMetadata: NFT[] | [];

    constructor(tokenId: string, imageUrl: string, name: string, xmasTrait: string, mergedMetadata: NFT[] | []) {
        this.tokenId = tokenId;
        this.imageUrl = imageUrl;
        this.name  = name;
        this.xmasTrait = xmasTrait;
        this.mergedMetadata = mergedMetadata;
    }
}