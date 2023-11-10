"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
function syncRedisKeys(sourceRedis, targetRedis) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, _i, keys_1, key, type, _a, value, list, set, zset, hash;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('start sync redis keys');
                    return [4 /*yield*/, sourceRedis.keys('*')];
                case 1:
                    keys = _b.sent();
                    _i = 0, keys_1 = keys;
                    _b.label = 2;
                case 2:
                    if (!(_i < keys_1.length)) return [3 /*break*/, 20];
                    key = keys_1[_i];
                    return [4 /*yield*/, sourceRedis.type(key)];
                case 3:
                    type = _b.sent();
                    console.log("key: ".concat(key, ", type: ").concat(type));
                    _a = type;
                    switch (_a) {
                        case 'string': return [3 /*break*/, 4];
                        case 'list': return [3 /*break*/, 7];
                        case 'set': return [3 /*break*/, 10];
                        case 'zset': return [3 /*break*/, 13];
                        case 'hash': return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 19];
                case 4: return [4 /*yield*/, sourceRedis.get(key)];
                case 5:
                    value = _b.sent();
                    return [4 /*yield*/, targetRedis.set(key, value)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 7: return [4 /*yield*/, sourceRedis.lrange(key, 0, -1)];
                case 8:
                    list = _b.sent();
                    return [4 /*yield*/, targetRedis.rpush.apply(targetRedis, __spreadArray([key], list, false))];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 10: return [4 /*yield*/, sourceRedis.smembers(key)];
                case 11:
                    set = _b.sent();
                    return [4 /*yield*/, targetRedis.sadd.apply(targetRedis, __spreadArray([key], set, false))];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 13: return [4 /*yield*/, sourceRedis.zrange(key, 0, -1, 'WITHSCORES')];
                case 14:
                    zset = _b.sent();
                    return [4 /*yield*/, targetRedis.zadd.apply(targetRedis, __spreadArray([key], zset, false))];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 16: return [4 /*yield*/, sourceRedis.hgetall(key)];
                case 17:
                    hash = _b.sent();
                    return [4 /*yield*/, targetRedis.hmset(key, hash)];
                case 18:
                    _b.sent();
                    return [3 /*break*/, 19];
                case 19:
                    _i++;
                    return [3 /*break*/, 2];
                case 20:
                    console.log('sync redis keys done');
                    return [2 /*return*/];
            }
        });
    });
}
var sourceRedis = new ioredis_1.default({ host: '192.168.0.211' });
var targetRedis = new ioredis_1.default({ host: '192.168.0.212' });
syncRedisKeys(sourceRedis, targetRedis).catch(console.error).finally(function () {
    sourceRedis.quit();
    targetRedis.quit();
});
