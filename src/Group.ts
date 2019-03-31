import { Entity } from "./Entity";

export class Group {

    protected _length: number = 0;
    protected _componentTypes: string[];
    protected _entityMap: { [key: string]: Entity } = {};

    /** @internal */
    constructor(...componentTypes: string[]) {
        if (componentTypes.length <= 0)
            console.error('group must have componentType they care');
        this._componentTypes = componentTypes;
    }

    // protected _listeners: ((e: Entity) => void)[] = [];

    // addEntityChangeListener(f: (e: Entity) => void) {
    //     this._listeners.push(f);
    // }

    // has(e: Entity): boolean {
    //     if (this._entityMap[e.id]) {
    //         return true;
    //     }
    //     return false;
    // }

    // support for..of this group
    /*
    *[Symbol.iterator]() {
        for (let i in this._entityMap) {
            yield this._entityMap[i];
        }
    }
    */

    forEach(f: (e: Entity) => void) {
        for (let i in this._entityMap) {
            f(this._entityMap[i]);
        }
    }

    get length() {
        return this._length;
    }

    get entityMap() {
        return this._entityMap; //todo: 确保外部不要修改这个数组
    }

    /** @internal */
    __remove(entity: Entity) {
        if (this._entityMap[entity.id]) {
            delete this._entityMap[entity.id];
            this._length--;
        }
    }

    /** @internal */
    __match(entity: Entity) {
        let id = entity.id;
        if (this._entityMap[id]) {
            if (!entity.has(...this._componentTypes)) {
                delete this._entityMap[id];
                this._length--;
            }
        } else {
            if (entity.has(...this._componentTypes)) {
                this._entityMap[id] = entity;
                this._length++;
            }
        }
    }

}