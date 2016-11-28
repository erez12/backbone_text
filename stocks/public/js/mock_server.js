"use strict";

const ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T']

let getRandom = (low, high) => Math.floor(Math.random()*(high - low + 1) + low);
let randomSlice = (arr, length) => {
    let low = getRandom(0, arr.length - (length || 1));
    let high = getRandom(0, arr.length);
    if (length) {
        high = low + length;
    }

    return arr.slice(low, high);
}
let getRandomOccupations = () => occupations[getRandom(0, occupations.length - 1)];
let getStatus = () => getRandom(0, 1);
let getRandomStockId = () => {
    let val = randomSlice(ABC, 3).join('');
    if (!val || getRandomStockId.__oldValues && getRandomStockId.__oldValues[val]) {
        return getRandomStockId();
    }

    getRandomStockId.__oldValues = getRandomStockId.__oldValues || {};
    getRandomStockId.__oldValues[val] = true;
    return val;
};
let getRandomPrice = () => faker.commerce.price(0, 1000, 2);
let getRandomCompanyName = (unique) => faker.company.companyName();
let getRandomData = () => {
    return {price: getRandomPrice(), status: !!getStatus() ? 'up' : 'down'};
};
let times = (count, func) => {
    let results = [];
    for (var i = 0; i < count; i++){
        results.push(func());
    }

    return results;
};

let stockIds = times(10, () => {
    let stockId = getRandomStockId(true);
    peopleCollection.add(Object.assign(getRandomData(), {__id: stockId, name: getRandomCompanyName()}));
    return stockId;
});

let a = setInterval(function (){
    randomSlice(stockIds).forEach((id) => {
        let child = peopleCollection.findWhere({__id: id});
        child.set(getRandomData());
    });
}, 500);
