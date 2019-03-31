import { Entity } from "./Entity";
export declare class Group {
    protected _length: number;
    protected _componentTypes: string[];
    protected _entityMap: {
        [key: string]: Entity;
    };
    forEach(f: (e: Entity) => void): void;
    readonly length: number;
    readonly entityMap: {
        [key: string]: Entity;
    };
}
