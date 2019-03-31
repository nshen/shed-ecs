import { ECS } from './ECS';
export declare class Entity {
    protected _ecs: ECS;
    protected _id: string;
    protected _comps: {
        [key: string]: {
            type: string;
            [key: string]: any;
        };
    };
    private static __uniqueID;
    constructor(ecs: ECS, name?: string);
    readonly id: string;
    add(...components: {
        type: string;
        [key: string]: any;
    }[]): void;
    remove(...componentTypes: string[]): void;
    has(...componentTypes: string[]): boolean;
    get(componentType: string): {
        [key: string]: any;
        type: string;
    };
    toString(): string;
}
