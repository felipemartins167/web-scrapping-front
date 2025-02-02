export class ProductModel {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    reviews: number;
    reviewsTotal: number;
    url: string;
    marketPlace: string;
    priceFrom: number;
    priceTo: number;
    priceLocal: string;
    createdAt: Date;
    updatedAt: Date;
    
    constructor(name: string, price: number, description: string, imageUrl: string, reviews: number, reviewsTotal: number, url: string, marketPlace: string, priceFrom: number, priceTo: number, priceLocal: string, createdAt: Date, updatedAt: Date) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.reviews = reviews;
        this.reviewsTotal = reviewsTotal;
        this.url = url;
        this.marketPlace = marketPlace;
        this.priceFrom = priceFrom;
        this.priceTo = priceTo;
        this.priceLocal = priceLocal;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}