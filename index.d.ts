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
export function pick<T, K>(obj: T, keys: K[]): Pick<T, K>;
export function omit<T, K>(obj: T, keys: K[]): Omit<T, K>;
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
    import randName = makeName;
    export { randName };
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
    import pick = pick;
    export { pick };
    import omit = omit;
    export { omit };
}
export namespace arrays {
    import dupeVals = dupeVals;
    export { dupeVals };
    import dedupe = dedupe;
    export { dedupe };
    import dedupeVal = dedupeVal;
    export { dedupeVal };
    import chunk = chunk;
    export { chunk };
    import shuffle = shuffle;
    export { shuffle };
    import range = range;
    export { range };
    import deepFlat = deepFlat;
    export { deepFlat };
    import strToArr = strToArr;
    export { strToArr };
    import groupBy = groupBy;
    export { groupBy };
    import ungroupBy = ungroupBy;
    export { ungroupBy };
    import keyBy = keyBy;
    export { keyBy };
    import partition = partition;
    export { partition };
}
export namespace functions {
    import attempt = attempt;
    export { attempt };
    import times = times;
    export { times };
    import throttle = throttle;
    export { throttle };
    import debounce = debounce;
    export { debounce };
    import compose = compose;
    export { compose };
    import pipe = pipe;
    export { pipe };
    import id = id;
    export { id };
}
export namespace logging {
    import sLog = sLog;
    export { sLog };
    import cLog = cLog;
    export { cLog };
    import log = log;
    export { log };
    import progress = progress;
    export { progress };
    import time = timer;
    export { time };
    import quickTime = quickTime;
    export { quickTime };
    import sleep = sleep;
    export { sleep };
    import clip = copy;
    export { clip };
    import prettyTime = prettyTime;
    export { prettyTime };
    import obfuscate = obfuscate;
    export { obfuscate };
    import tracker = tracker;
    export { tracker };
    import logger = logger;
    export { logger };
}
/**
 * Generic object with string keys
 */
export type Dictionary<T> = Record<string, T>;
/**
 * Generic object with any value types
 */
export type AnyObject = Record<string, unknown>;
/**
 * Array of objects
 */
export type ArrayOf<T> = T[];
/**
 * Constructor function type
 */
export type Constructor<T> = new (...args: any[]) => T;
export type GCSUri = {
    uri: string;
    bucket: string;
    file: string;
};
export type filterCallback = (keyOrValue: string) => any;
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
declare namespace ___Users_ak_code_ak_tools_index_ { }
export { objFilter as objFilt, clip as copy, objClean as cleanObj, objClone as clone, objAwait as awaitObj, objTypecast as typecastInt, time as timer };
