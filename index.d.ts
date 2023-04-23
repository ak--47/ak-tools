declare module "ak-tools" {
    export function ls(dir?: string, objectMode?: boolean): Promise<string[] | generalObject>;
    export function rm(fileNameOrPath: string, log?: boolean, throws?: boolean): Promise<string | boolean | void>;
    export function touch(
        fileNameOrPath: string,
        data?: string | generalObject | arrayOfObjects,
        isJson?: boolean,
        log?: boolean,
        throws?: boolean
    ): Promise<string | false>;
    export function load(
        fileNameOrPath: string,
        isJson?: boolean,
        encoding?: string,
        log?: boolean,
        throws?: boolean
    ): Promise<string | generalObject | arrayOfObjects>;
    export function mkdir(dirPath?: string): string;
    export function isJSONStr(string: string): boolean;
    export function isJSON(data: string | JSON): boolean;
    export function is(type: "string" | any, val: any): boolean;
    export function isNil(val: any): boolean;
    export function similar(o1: generalObject, o2: generalObject): boolean;
    export function comma(num: string | number): string;
    export function truncate(text: string, chars?: number, useWordBoundary?: boolean): string;
    export function bytesHuman(bytes: number, dp?: number, si?: boolean): string;
    export function json(data: object, padding?: number): string | false;
    export function stripHTML(str: string): string;
    export function multiReplace(str: string, replacePairs?: Array<Array<string, string>>): string;
    export function replaceAll(oldVal: string | RegExp, newVal: string): string;
    export function toCSV(arr: Array<string[] | number[]>, headers?: string[], delimiter?: string): string;
    export function unBase64(b64Str: string): any;
    export function rand(min?: number, max?: number): number;
    export function avg(...nums: number[]): number;
    export function calcSize(data: string | generalObject): number;
    export function round(number: number, decimalPlaces?: number): number;
    export function uid(length?: number): string;
    export function uuid(): string;
    export function md5(data: any): string;
    export function rnKeys(obj: generalObject, newKeys: generalObject): generalObject;
    export function rnVals(obj: generalObject, pairs: Array<Array<string, string>>): generalObject;
    export function objFilter(hash: generalObject, test_function: filterCallback, keysOrValues?: "key" | "value"): generalObject;
    export function objClean(obj: generalObject, clone?: boolean): generalObject;
    export function objDefault(obj: generalObject, ...defs: any): generalObject;
    export function objMatch(obj: any, source: any): boolean;
    export function objClone(thing: any, opts?: any): any;
    export function objTypecast(obj: object, isClone?: boolean): any;
    export function objAwait(obj: { [x: string]: Promise<any> }): Promise<generalObject>;
    export function removeNulls(objWithNullOrUndef: any): any;
    export function flatten(obj: any, roots?: any[], sep?: string): any;
    export function objMap(object: any, mapFn: Function): {};
    export function getKey(object: any, value: any): string;
    export function dupeVals(array: any[], times?: number): any[];
    export function dedupe(arrayOfThings: any): any[];
    export function dedupeVal(arr: any[], keyNames: string[]): any[];
    export function chunk(sourceArray: any[], chunkSize: number): any[];
    export function shuffle(array: any[], mutate?: boolean): any[];
    export function range(min: number, max: number, step?: number): number[];
    export function deepFlat(arr: any[]): any[];
    export function strToArr(str: string, pattern?: RegExp): string[];
    export function attempt(fn: Function, ...args: any[]): Promise<any>;
    export function times(n: number, iteratee: Function, context: any): any[];
    export function throttle(
        func: Function,
        wait: number,
        options?: object
    ): {
        (...args: any[]): any;
        cancel(): void;
    };
    export function compose(...args: any[]): Function;
    export function id(any: any): any;
    export function cLog(data: string | JSON | object, message?: string, severity?: string, isCloud?: boolean): boolean;
    export function log(item: any, depth?: number, maxDepth?: number): void;
    export function progress(thing: string, p: number, message?: string): void;
    export function time(label: string): Timer;
    export function quickTime(callback: Function): any;
    export function tracker(app?: string, token?: string, distinct_id?: string): Function;
    export function sleep(ms: number): Promise<any>;
    export function clip(data: any): void;
    export namespace files {
        import ls = ls;
        export { ls };
        import rm = rm;
        export { rm };
        import touch = touch;
        export { touch };
        import load = load;
        export { load };
        import mkdir = mkdir;
        export { mkdir };
    }
    export namespace validate {
        import isJSONStr = isJSONStr;
        export { isJSONStr };
        import isJSON = isJSON;
        export { isJSON };
        import is = is;
        export { is };
        import isNil = isNil;
        export { isNil };
        import similar = similar;
        export { similar };
    }
    export namespace display {
        import comma = comma;
        export { comma };
        import truncate = truncate;
        export { truncate };
        import bytesHuman = bytesHuman;
        export { bytesHuman };
        import json = json;
        export { json };
        import stripHTML = stripHTML;
        export { stripHTML };
        import multiReplace = multiReplace;
        export { multiReplace };
        import replaceAll = replaceAll;
        export { replaceAll };
        import toCSV = toCSV;
        export { toCSV };
    }
    export namespace maths {
        import rand = rand;
        export { rand };
        import avg = avg;
        export { avg };
        import calcSize = calcSize;
        export { calcSize };
        import round = round;
        export { round };
        import uid = uid;
        export { uid };
        import uuid = uuid;
        export { uuid };
        import md5 = md5;
        export { md5 };
    }
    export namespace objects {
        import rnKeys = rnKeys;
        export { rnKeys };
        import rnVals = rnVals;
        export { rnVals };
        import objClean = cleanObj;
        export { objClean };
        import objDefault = objDefault;
        export { objDefault };
        import objMatch = objMatch;
        export { objMatch };
        import objClone = clone;
        export { objClone };
        import objTypecast = typecastInt;
        export { objTypecast };
        import objAwait = awaitObj;
        export { objAwait };
        import removeNulls = removeNulls;
        export { removeNulls };
        import flatten = flatten;
        export { flatten };
        import objMap = objMap;
        export { objMap };
        import getKey = getKey;
        export { getKey };
    }
    export const arrays: {};
    export const functions: {};
    export const logging: {};
    /**
     * generic for `{}` w/string keys
     */
    export type generalObject = {
        [x: string]: any;
    };
    /**
     * generic for `[{},{},{}]`
     */
    export type arrayOfObjects = generalObject[];
    export type filterCallback = (keyOrValue: string) => any;
    declare class Timer {
        constructor(label: any);
        label: any;
        startTime: number;
        endTime: number;
        delta: number;
        running: boolean;
        cycles: number;
        stop: (consoleOutput?: boolean) => void;
        start(): void;
        end(consoleOutput?: boolean): void;
        report(consoleOutput?: boolean): {
            label: any;
            start: number;
            end: number;
            delta: number;
            human: string;
            cycles: number;
        };
        prettyTime(milliseconds: any): string;
    }
    declare namespace __index_ {}
    export {
        objFilter as objFilt,
        clip as copy,
        objClean as cleanObj,
        objClone as clone,
        objAwait as awaitObj,
        objTypecast as typecastInt,
        time as timer
    };
}
