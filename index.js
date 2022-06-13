#!/usr/bin/env node
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        while (_) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.__esModule = true;
var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var opens = require('open');
var fs = require("fs");
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/schedule_maker'));
app.get('/api/v1/openFile', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('open filePath=', req.query.filePath);
        if (req.query.filePath) {
            opens('file://' + req.query.filePath);
            res.status(200).json({ success: true });
        }
        else {
            res.json({ success: false, error: 'Unknown Error' });
        }
        return [2 /*return*/];
    });
}); });
app.get("/api/v1/search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var path, searchStatement, _a, _b, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log(req.query);
                path = req.query.path;
                searchStatement = req.query.searchStatement;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                _b = (_a = res).json;
                _c = { success: true };
                return [4 /*yield*/, beginSearch(path, searchStatement)];
            case 2:
                _b.apply(_a, [(_c.data = _d.sent(), _c)]);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                res.json({ success: false, msg: error_1 && error_1.message, info: error_1 && error_1.info, stack: error_1 && error_1.stack });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/*', function (req, res) {
    console.log('/*', path.join(__dirname));
    res.sendFile(path.join(__dirname));
});
app.listen(process.env['PORT'] || 4444, function () { return console.log('Running on port:', process.env['PORT'] || 4444); });
//             VVV Functions VVV
function beginSearch(path, searchStatement) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    return [4 /*yield*/, search(path, searchStatement)];
                case 1:
                    result = _a.sent();
                    result.time = Date.now() - startTime;
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * recursive function that will take folder|file path and if path is folder it'll call its self until it reaches the leaf AKA file
 * @param path folder or file
 * @param searchStatement
 * @returns
 */
function getHtmlFiles(path) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                fs.opendir(path, function (err, dir) {
                    var dir_1, dir_1_1;
                    var e_1, _a;
                    return __awaiter(this, void 0, void 0, function () {
                        var userData, htmlFiles, f, _b, ud, hf, e_1_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (err)
                                        throw err;
                                    userData = { numOfAllFiles: 0 };
                                    htmlFiles = [];
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 8, 9, 14]);
                                    dir_1 = __asyncValues(dir);
                                    _c.label = 2;
                                case 2: return [4 /*yield*/, dir_1.next()];
                                case 3:
                                    if (!(dir_1_1 = _c.sent(), !dir_1_1.done)) return [3 /*break*/, 7];
                                    f = dir_1_1.value;
                                    if (!f.isDirectory()) return [3 /*break*/, 5];
                                    return [4 /*yield*/, getHtmlFiles(path + '\\' + f.name)];
                                case 4:
                                    _b = _c.sent(), ud = _b.userData, hf = _b.htmlFiles;
                                    userData.numOfAllFiles += ud.numOfAllFiles;
                                    htmlFiles = __spreadArray(__spreadArray([], htmlFiles, true), hf, true);
                                    return [3 /*break*/, 6];
                                case 5:
                                    if (f.name.includes('.html')) {
                                        userData.numOfAllFiles++;
                                        htmlFiles.push(path + '\\' + f.name);
                                    }
                                    else
                                        userData.numOfAllFiles++;
                                    _c.label = 6;
                                case 6: return [3 /*break*/, 2];
                                case 7: return [3 /*break*/, 14];
                                case 8:
                                    e_1_1 = _c.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 14];
                                case 9:
                                    _c.trys.push([9, , 12, 13]);
                                    if (!(dir_1_1 && !dir_1_1.done && (_a = dir_1["return"]))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, _a.call(dir_1)];
                                case 10:
                                    _c.sent();
                                    _c.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 13: return [7 /*endfinally*/];
                                case 14:
                                    resolve({ userData: userData, htmlFiles: htmlFiles });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            }
            catch (e) {
                reject(e);
            }
            return [2 /*return*/];
        });
    }); });
}
/**
 *
 * @param filesPath array of html path files that will be searched on
 * @param searchStatement
 */
function search(path, searchStatement) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var _a, userData, htmlFiles, regEx, resultFiles, numOfOpenedFiles, counter, _loop_1, out_i_1, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getHtmlFiles(path)];
                case 1:
                    _a = _b.sent(), userData = _a.userData, htmlFiles = _a.htmlFiles;
                    userData.numOfHtmlFiles = htmlFiles.length;
                    try {
                        regEx = convertRegEx(searchStatement);
                    }
                    catch (err) {
                        return [2 /*return*/, reject(new MyError('Invalid Regular Expression', err))];
                    }
                    resultFiles = [];
                    numOfOpenedFiles = 100;
                    counter = 0;
                    _loop_1 = function (i) {
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!((i - counter) === numOfOpenedFiles)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, sleep(0)];
                                case 1:
                                    _c.sent();
                                    i--;
                                    return [3 /*break*/, 3];
                                case 2:
                                    searchOnFile(htmlFiles[i], regEx).then(function (is) { counter++; if (is === true)
                                        resultFiles.push(htmlFiles[i]); });
                                    _c.label = 3;
                                case 3:
                                    out_i_1 = i;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < htmlFiles.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _b.sent();
                    i = out_i_1;
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, sleep(0)];
                case 6:
                    _b.sent(); //prevent search resolve while there are files being searched on
                    _b.label = 7;
                case 7:
                    if (counter !== htmlFiles.length) return [3 /*break*/, 5];
                    _b.label = 8;
                case 8:
                    userData.resultFiles = resultFiles;
                    resolve(userData);
                    return [2 /*return*/];
            }
        });
    }); });
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(''); }, ms); });
}
/**
 * use me with then not await 'cause of performance
 * @param path html file full path
 * @param regEx
*/
function searchOnFile(path, regEx) {
    // var chunksArr: string[] = [];
    return new Promise(function (resolve, reject) {
        var readStream = fs.createReadStream(path, 'utf8');
        readStream.on('error', function (e) {
            reject(new MyError("readStream Throw an Error", e));
        });
        readStream.on('data', function (chunk) {
            if (regEx.test(chunk)) {
                readStream.close();
                return resolve(true);
            }
        });
        readStream.on('close', function () {
            return resolve(false); //!temp 
        });
    });
}
function convertRegEx(st) {
    if (st.charAt(0) == '/' && st.substring(1).includes('/')) {
        var splitted = st.split('/');
        var pattern = splitted[1];
        var flags = splitted[2];
        return new RegExp(pattern, flags);
    }
    return new RegExp(st);
}
var MyError = /** @class */ (function (_super) {
    __extends(MyError, _super);
    function MyError(message, error) {
        var _this = _super.call(this, message) || this;
        _this.error = error;
        return _this;
    }
    return MyError;
}(Error));
