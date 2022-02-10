export class MarketDataInfo {
    public price: number
    public marketCap: number
    public volume: number
    public change: number

    constructor(price: number, marketCap: number, volume: number, change: number) {
        this.price = price
        this.marketCap = marketCap
        this.volume = volume
        this.change = change
    }
}

export class UsdEthMarketDataInfo {
    public usdMarketData: MarketDataInfo
    public ethMarketData: MarketDataInfo

    constructor(usdMarketData: MarketDataInfo, ethMarketData: MarketDataInfo) {
        this.usdMarketData = usdMarketData
        this.ethMarketData = ethMarketData
    }
}