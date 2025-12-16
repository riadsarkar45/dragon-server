"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffFromToday = exports.startOfDay = void 0;
const startOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};
exports.startOfDay = startOfDay;
const diffFromToday = (expireDate) => {
    const today = (0, exports.startOfDay)();
    const expire = (0, exports.startOfDay)(expireDate);
    return Math.floor((expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
exports.diffFromToday = diffFromToday;
