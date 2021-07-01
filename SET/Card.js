export default class Card{                 //Átmenetileg ez is legyen itt.
    cardID;
    multiplicity;
    filter;
    color;
    shape;

    constructor(ID){
        this.cardID = ID
        this.multiplicity = Number.parseInt(ID[0])    //1,2,3
        this.filter = ID[1]
        this.color = ID[2]
        this.shape = ID[3]
    }
}