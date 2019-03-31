import { ECS } from './ECS'

export class Entity {

    protected _ecs: ECS;
    protected _id: string;
    protected _comps: { [key: string]: { type: string;[key: string]: any } } = {};
    private static __uniqueID: number = 0;

    constructor(ecs: ECS, name: string = 'Entity') {
        this._id = String(name + Entity.__uniqueID++);
        this._ecs = ecs;
    }

    get id(): string {
        return this._id;
    }

    add(...components: { type: string;[key: string]: any }[]) {
        components.forEach(c => {
            if (!c.type) {
                console.error('component need type property.');
            } else if (!this._comps[c.type]) {
                this._comps[c.type] = c;
            }
        });
        this._ecs.__dirty(this);
    }

    remove(...componentTypes: string[]) {
        componentTypes.forEach(c => {
            if (this._comps[c])
                delete this._comps[c];
        });
        this._ecs.__dirty(this);
    }

    has(...componentTypes: string[]) {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this._comps[componentTypes[i]])
                return false;
        }
        return true;
    }

    get(componentType: string) {
        return this._comps[componentType];
    }

    toString() {
        return JSON.stringify({ _id: this._id, _comps: this._comps }, null, 4);
    }

}