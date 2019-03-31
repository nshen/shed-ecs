import { Entity } from './Entity';
import { Group } from './Group';
import { System } from './System';
export declare class ECS {
    protected _entityMap: {
        [key: string]: Entity;
    };
    protected _groups: Group[];
    protected _groupCache: {
        [key: string]: Group;
    };
    protected _systems: System[];
    protected _dirtyMap: {
        [key: string]: Entity;
    };
    state: {
        [key: string]: any;
    };
    addNewEntity(name: string, ...components: {
        type: string;
        [key: string]: any;
    }[]): Entity;
    createEntity(name: string, ...components: {
        type: string;
        [key: string]: any;
    }[]): Entity;
    addEntity(e: Entity): void;
    removeEntity(entity: Entity): Entity;
    getGroup(...componentTypes: string[]): Group;
    addSystem<T extends System>(sys: T): void;
    update(): void;
    __updateGroups(): void;
}
