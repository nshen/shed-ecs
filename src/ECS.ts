import { Entity } from './Entity';
import { Group } from './Group';
import { System } from './System';

export class ECS {

    protected _entityMap: { [key: string]: Entity } = {};
    protected _groups: Group[] = [];
    protected _groupCache: { [key: string]: Group } = {};
    protected _systems: System[] = [];
    protected _dirtyMap: { [key: string]: Entity } = {};
    public state: { [key: string]: any } = {};

    addNewEntity(name: string, ...components: { type: string;[key: string]: any }[]) {
        let e = new Entity(this, name);
        this._entityMap[e.id] = e;
        if (components.length > 0) {
            e.add(...components);
        }
        return e;
    }

    createEntity(name: string, ...components: { type: string;[key: string]: any }[]): Entity {
        let e = new Entity(this, name);
        if (components.length > 0) {
            e.add(...components);
        }
        return e;
    }

    addEntity(e: Entity) {
        if (!this._entityMap[e.id]) {
            this._entityMap[e.id] = e;
            this.__dirty(e);
        }
    }

    // 直接删除，包括从所有组删除
    removeEntity(entity: Entity): Entity {
        if (this._entityMap[entity.id]) {
            delete this._entityMap[entity.id];
            if (this._dirtyMap[entity.id])
                delete this._dirtyMap[entity.id];
            if (this._groups.length > 0) {
                this._groups.forEach(group => {
                    group.__remove(entity);
                })
            }
        }
        return entity;
    }

    getGroup(...componentTypes: string[]) {
        let key = componentTypes.sort().join('_');
        if (this._groupCache[key])
            return this._groupCache[key];
        let g = new Group(...componentTypes);
        for (const id in this._entityMap) {
            g.__match(this._entityMap[id]);
        }
        this._groups.push(g)
        this._groupCache[key] = g;
        return g;
    }

    addSystem<T extends System>(sys: T): void {
        this._systems.push(sys);
    }

    update() {
        for (let i = 0; i < this._systems.length; i++) {
            this.__updateGroups();
            this._systems[i].update();
        }
    }

    __updateGroups() {
        for (let g = 0; g < this._groups.length; g++) {
            for (let i in this._dirtyMap) {
                this._groups[g].__match(this._dirtyMap[i])
            }
        }
        this._dirtyMap = {};
    }

    // 新添加的entity，或者entity本身添加删除components时被调用
    /** @internal */
    __dirty(entity: Entity) {
        // 标记dirty，每个system.update后统一调用__updateGroups匹配到group
        if (!this._dirtyMap[entity.id])
            this._dirtyMap[entity.id] = entity;
    }
}