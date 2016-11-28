"use strict";

const fs = require('fs');
const _ = require('lodash');
const faker = require('./faker');
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
let saveFile = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), function(err) {
        if(err) {
            reject(err);
            return;
        }

        resolve();
    });
});
let saveStocksData = (newData) => saveFile("./stocks.json", newData);
let stocksData = require('./stocks.json');

let generateNewStockData = () => new Promise((resolve, reject) => {
    let newStocksData = times(10, () => Object.assign(getRandomData(), {id: getRandomStockId(), name: getRandomCompanyName()}));
    saveStocksData(newStocksData).then(() => resolve(newStocksData));
});

module.exports.getAll = () => Promise.resolve(stocksData);
module.exports.updateStockData = () => new Promise(function(resolve, reject) {
    // Note: Object assign does an inplace change
    let newData = randomSlice(stocksData).map((stock) => Object.assign(stock, getRandomData()));
    saveStocksData(stocksData).then(() => resolve(newData));
});
