import { ECS } from "./ECS";
export declare class System {
    protected _ecs: ECS;
    constructor(ecs: ECS);
    update(): void;
}
