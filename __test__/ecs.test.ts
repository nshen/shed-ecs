import { ECS, Entity, Group, System } from "../src/index";


let ecs: ECS;

beforeEach(() => {
    ecs = new ECS();
})

test('entity.has() should works', () => {
    let me = ecs.createEntity();
    me.add(
        { type: 'aaa' },
        { type: 'bbb' },
        { type: 'ccc' }
    )
    expect(me.has('aaa', 'bbb', 'ccc')).toBeTruthy();
    expect(me.has('ccc', 'bbb', 'aaa')).toBeTruthy();
    expect(me.has('aaa', 'bbb')).toBeTruthy();
    expect(me.has('aaa', 'ccc')).toBeTruthy();
    expect(me.has('bbb', 'ccc')).toBeTruthy();
    expect(me.has('aaa')).toBeTruthy();
    expect(me.has('bbb')).toBeTruthy();
    expect(me.has('ccc')).toBeTruthy();

    expect(me.has('ddd')).toBeFalsy();
    expect(me.has('aaa', 'ddd')).toBeFalsy();
    expect(me.has('aaa', 'bbb', 'ddd')).toBeFalsy();
    expect(me.has('aaa', 'bbb', 'ccc', 'ddd')).toBeFalsy();
    expect(me.has('bbb', 'ccc', 'ddd')).toBeFalsy();
});


test('group should works', () => {

    let componentA = { type: 'aaa' };
    let componentB = { type: 'bbb' };
    let componentC = { type: 'ccc' };
    let componentD = { type: 'ddd' };

    let e1 = ecs.createEntity(componentA);
    let e2 = ecs.createEntity(componentB);
    let e3 = ecs.createEntity(componentC);
    let e4 = ecs.createEntity(componentD);

    ecs.createEntity(
        componentB,
        componentC,
        componentD
    )

    ecs.createEntity(componentC, componentD);
    ecs.createEntity(componentD);
    //-----------------

    let g1 = ecs.createGroup(componentA.type);
    expect(g1.length).toBe(1);

    let g2 = ecs.createGroup('aaa', 'bbb');
    expect(g2.length).toBe(0);

    let g3 = ecs.createGroup('aaa', 'bbb', 'ccc');
    expect(g3.length).toBe(0);

    let g4 = ecs.createGroup('ddd', 'bbb', 'ccc');
    expect(g4.length).toBe(1);

    expect(ecs.createGroup(componentB.type).length).toBe(2);
    expect(ecs.createGroup(componentC.type).length).toBe(3);
    expect(ecs.createGroup(componentD.type).length).toBe(4);
    expect(ecs.createGroup(componentD.type, componentC.type).length).toBe(2);

})

test('should System works', () => {


    class Com1System extends System {
        protected group1: Group;

        constructor(ecs: ECS) {
            super(ecs);
            this.group1 = this._ecs.createGroup('com1');
        }

        update() {
            expect(this.group1.length).toBe(1);
            for (const entity of this.group1) {
                expect(entity.get('com1').x).toBe(3);
                expect(entity.get('com1').y).toBe(0);
            }
            // for (let i in this.com1_group.entityMap) {
            //     expect(this.com1_group.entityMap[i].get('com1').x).toBe(3);
            //     expect(this.com1_group.entityMap[i].get('com1').y).toBe(0);
            // }
        }
    }


    ecs.createEntity(
        { type: 'com1', x: 3, y: 0 },
        { type: 'com2', img: 'sss.png' }
    )
    ecs.addSystem(new Com1System(ecs));

    ecs.update()


})
