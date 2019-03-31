import { ECS } from "./ECS";

export class System {

    protected _ecs: ECS;
    
    constructor(ecs: ECS) {
        this._ecs = ecs;
    }

    update() {

    }
}