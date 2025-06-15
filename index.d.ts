// TypeScript declarations for ak-tools
export function ls(dir?: string, objectMode?: boolean): Promise<string[] | Dictionary<string>>;
export function rm(fileNameOrPath: string, log?: boolean, throws?: boolean): Promise<void | false>;
export function touch(fileNameOrPath: string, data?: string | AnyObject | unknown[], isJson?: boolean, log?: boolean, throws?: boolean): Promise<string | false>;
export function load<T>(fileNameOrPath: string, isJson?: boolean, encoding?: BufferEncoding, log?: boolean, throws?: boolean): Promise<string | T | undefined>;
export function mkdir(dirPath?: string): string;
export function makeExist(filePath: any): Promise<boolean>;
export function isDirOrFile(filePath: string): "directory" | "file" | false;
export function details(filePath: string, options?: {
    maxDepth: number;
    exclude: Array<string>;
}): any | false;
export function isJSONStr(string: string): boolean;
export function isJSON(data: unknown): boolean;
export function is<T>(type: string | Constructor<T>, val: unknown): val is T;
export function isNil(val: unknown): val is null | undefined;
export function similar(o1: AnyObject | null, o2: AnyObject | null): boolean;
export function parseGCSUri(uri: string): GCSUri;
export function toBool(string: any): boolean;
export function comma(num: (string | number)): string;
export function truncate(text: string, chars?: number, useWordBoundary?: boolean): string;
export function bytesHuman(bytes: number, dp?: number, si?: boolean): string;
export function json(data: object, padding?: number): string | false;
export function stripHTML(str: string): string;
export function multiReplace(str: string, replacePairs?: Array<Array<string, string>>): string;
export function replaceAll(oldVal: (string | RegExp), newVal: (string)): string;
export function toCSV(arr: Array<string[] | number[]>, headers?: string[], delimiter?: string): string;
export function unBase64(b64Str: string): any;
export function rand(min?: number, max?: number): number;
export function avg(...nums: number[]): number;
export function calcSize(data: (string | generalObject)): number;
export function round(number: number, decimalPlaces?: number): number;
export function uid(length?: number): string;
export function uuid(): string;
export function md5(data: any): string;
export function makeName(words?: number, separator?: string): string;
export function rnKeys<T>(obj: Record<string, T>, newKeys: Dictionary<string>): Record<string, T>;
export function rnVals(obj: generalObject, pairs: Array<Array<string, string>>): generalObject;
export function objFilter(hash: generalObject, test_function: filterCallback, keysOrValues?: "key" | "value"): generalObject;
export function objClean(obj: generalObject, clone?: boolean): generalObject;
export function objDefault(obj: generalObject, ...defs: any): generalObject;
export function objMatch(obj: any, source: any): boolean;
export function objClone(thing: any, opts?: any): any;
export function objTypecast(obj: object, isClone?: boolean): any;
export function objAwait(obj: {
    [x: string]: Promise<any>;
}): Promise<generalObject>;
export function removeNulls(objWithNullOrUndef: any): any;
export function flatten(obj: any, roots?: any[], sep?: string): any;
export function objMap(object: any, mapFn: Function): any;
export function getKey(object: any, value: any): string;
export function makeCSV(data: Array<any>, charLimit?: number): string;
export function dupeVals(array: any[], times?: number): any[];
export function dedupe(arrayOfThings: any): any[];
export function dedupeVal(arr: any[], keyNames: string[]): any[];
export function chunk(sourceArray: any[], chunkSize: number): any[];
export function shuffle(array: any[], mutate?: boolean): any[];
export function range(min: number, max: number, step?: number): number[];
export function deepFlat(arr: any[]): any[];
export function strToArr(str: string, pattern?: RegExp): string[];
export function groupBy<T>(array: T[], keyOrFn: string | ((item: T) => string | number)): Dictionary<T[]>;
export function ungroupBy<T>(groupedObj: Dictionary<T[]>): T[];
export function keyBy<T>(array: T[], keyOrFn: string | ((item: T) => string | number)): Dictionary<T>;
export function partition<T>(array: T[], predicate: (item: T, index: number) => boolean): [T[], T[]];
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export function debounce(func: Function, wait: number, immediate?: boolean): Function;
export function pipe(...functions: Function[]): Function;
export function attempt(fn: Function, ...args: any[]): Promise<any>;
export function times(n: number, iteratee: Function, context: any): any[];
export function throttle(func: Function, wait: number, options?: object): {
    (...args: any[]): any;
    cancel(): void;
};
export function compose(...args: any[]): Function;
export function id(any: any): any;
export function sLog(message?: string, data: (string | JSON | object), severity?: string | "DEFAULT" | "DEBUG" | "INFO" | "NOTICE" | "WARNING" | "ERROR" | "CRITICAL" | "ALERT" | "EMERGENCY"): void;
export function logger(initialProps?: any): StructuredLogger;
export function cLog(data: (string | JSON | object), message?: string, severity?: string, isCloud?: boolean): boolean;
export function log(item: any, depth?: number, maxDepth?: number): void;
export function progress(arrayOfArrays: [string, number][]): void;
export function obfuscate(str: string): string;
export function time(label: string): Timer;
export function quickTime(callback: Function): any;
export function tracker(app?: string, token?: string, distinct_id?: string): Function;
export function sleep(ms: number): Promise<any>;
export function clip(data: any): void;
export function prettyTime(milliseconds: number): string;

// Namespace exports
export namespace files {
    export { ls, rm, touch, load, mkdir };
}
export namespace validate {
    export { isJSONStr, isJSON, is, isNil, similar };
}
export namespace display {
    export { comma, truncate, bytesHuman, json, stripHTML, multiReplace, replaceAll, toCSV };
}
export namespace maths {
    export { rand, avg, calcSize, round, uid, uuid, md5, makeName as randName };
}
export namespace objects {
    export { rnKeys, rnVals, objClean as cleanObj, objDefault, objMatch, objClone as clone, objTypecast as typecastInt, objAwait as awaitObj, removeNulls, flatten, objMap, getKey, pick, omit };
}
export namespace arrays {
    export { dupeVals, dedupe, dedupeVal, chunk, shuffle, range, deepFlat, strToArr, groupBy, ungroupBy, keyBy, partition };
}
export namespace functions {
    export { attempt, times, throttle, debounce, compose, pipe, id };
}
export namespace logging {
    export { sLog, cLog, log, progress, time as timer, quickTime, sleep, clip as copy, prettyTime, obfuscate, tracker, logger };
}

// Type definitions
export type Dictionary<T> = Record<string, T>;
export type AnyObject = Record<string, unknown>;
export type ArrayOf<T> = T[];
export type Constructor<T> = new (...args: any[]) => T;
export type GCSUri = {
    uri: string;
    bucket: string;
    file: string;
};
export type filterCallback = (keyOrValue: string) => any;
export type generalObject = Record<string, any>;

declare class StructuredLogger {
    constructor(initialProps?: {});
    initialProps: {};
    createChild(additionalProps?: {}): StructuredLogger;
    log(message?: string, data?: {}, severity?: string): void;
}

declare class Timer {
    constructor(label: any);
    label: any;
    startTime: number;
    endTime: number;
    delta: number;
    running: boolean;
    cycles: number;
    stop: (consoleOutput?: boolean) => string;
    start(): void;
    end(consoleOutput?: boolean): string;
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

// Aliases
export { objFilter as objFilt, clip as copy, objClean as cleanObj, objClone as clone, objAwait as awaitObj, objTypecast as typecastInt, time as timer };