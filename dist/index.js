'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Entity {
  constructor(ecs, name = 'Entity') {
    this._ecs = void 0;
    this._id = void 0;
    this._comps = {};
    this._id = String(name + Entity.__uniqueID++);
    this._ecs = ecs;
  }

  get id() {
    return this._id;
  }

  add(...components) {
    components.forEach(c => {
      if (!c.type) {
        console.error('component need type property.');
      } else if (!this._comps[c.type]) {
        this._comps[c.type] = c;
      }
    });

    this._ecs.__dirty(this);
  }

  remove(...componentTypes) {
    componentTypes.forEach(c => {
      if (this._comps[c]) delete this._comps[c];
    });

    this._ecs.__dirty(this);
  }

  has(...componentTypes) {
    for (let i = 0; i < componentTypes.length; i++) {
      if (!this._comps[componentTypes[i]]) return false;
    }

    return true;
  }

  get(componentType) {
    return this._comps[componentType];
  }

  toString() {
    return JSON.stringify({
      _id: this._id,
      _comps: this._comps
    }, null, 4);
  }

}
Entity.__uniqueID = 0;

class Group {
  /** @internal */
  constructor(...componentTypes) {
    this._length = 0;
    this._componentTypes = void 0;
    this._entityMap = {};
    if (componentTypes.length <= 0) console.error('group must have componentType they care');
    this._componentTypes = componentTypes;
  } // protected _listeners: ((e: Entity) => void)[] = [];
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


  forEach(f) {
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


  __remove(entity) {
    if (this._entityMap[entity.id]) {
      delete this._entityMap[entity.id];
      this._length--;
    }
  }
  /** @internal */


  __match(entity) {
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

class ECS {
  constructor() {
    this._entityMap = {};
    this._groups = [];
    this._groupCache = {};
    this._systems = [];
    this._dirtyMap = {};
    this.state = {};
  }

  addNewEntity(name, ...components) {
    let e = new Entity(this, name);
    this._entityMap[e.id] = e;

    if (components.length > 0) {
      e.add(...components);
    }

    return e;
  }

  createEntity(name, ...components) {
    let e = new Entity(this, name);

    if (components.length > 0) {
      e.add(...components);
    }

    return e;
  }

  addEntity(e) {
    if (!this._entityMap[e.id]) {
      this._entityMap[e.id] = e;

      this.__dirty(e);
    }
  } // 直接删除，包括从所有组删除


  removeEntity(entity) {
    if (this._entityMap[entity.id]) {
      delete this._entityMap[entity.id];
      if (this._dirtyMap[entity.id]) delete this._dirtyMap[entity.id];

      if (this._groups.length > 0) {
        this._groups.forEach(group => {
          group.__remove(entity);
        });
      }
    }

    return entity;
  }

  getGroup(...componentTypes) {
    let key = componentTypes.sort().join('_');
    if (this._groupCache[key]) return this._groupCache[key];
    let g = new Group(...componentTypes);

    for (const id in this._entityMap) {
      g.__match(this._entityMap[id]);
    }

    this._groups.push(g);

    this._groupCache[key] = g;
    return g;
  }

  addSystem(sys) {
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
        this._groups[g].__match(this._dirtyMap[i]);
      }
    }

    this._dirtyMap = {};
  } // 新添加的entity，或者entity本身添加删除components时被调用

  /** @internal */


  __dirty(entity) {
    // 标记dirty，每个system.update后统一调用__updateGroups匹配到group
    if (!this._dirtyMap[entity.id]) this._dirtyMap[entity.id] = entity;
  }

}

class System {
  constructor(ecs) {
    this._ecs = void 0;
    this._ecs = ecs;
  }

  update() {}

}

exports.ECS = ECS;
exports.Entity = Entity;
exports.Group = Group;
exports.System = System;
//# sourceMappingURL=index.js.map
