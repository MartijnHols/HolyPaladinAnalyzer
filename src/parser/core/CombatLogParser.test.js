import CombatLogParser from './CombatLogParser';

class MyModule {}
const myModule = new MyModule();
class MySubModule extends MyModule {}
const mySubModule = new MySubModule();
class EmptyCombatLogParser extends CombatLogParser {
  static internalModules = {};
  static defaultModules = {};
  static specModules = {};
}
const fakeReport = {
  friendlies: [],
  friendlyPets: [],
};
const fakePlayer = {
  id: 1,
};
const fakeFight = {};
const fakeCombatants = [
  {
    sourceID: 1,
    specID: 62,
    auras: [],
    talents: [],
    artifact: [],
    gear: [],
  },
];

// This uses `_modules` on the CombatLogParser. I know I shouldn't test private properties! But using the modules property directly throws a deprecation warning for now, and this is probably only temporary. So this is only a temp fix. (lol who am I kidding)

describe('Core/CombatLogParser', () => {
  describe('module defining', () => {
    it('loads default modules', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        static defaultModules = {
          myModule: MyModule,
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser._modules.myModule).toBeInstanceOf(MyModule);
      expect(Object.keys(parser._modules).length).toBe(1);
    });
    it('loads spec modules', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        static specModules = {
          myModule: MyModule,
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      expect(parser._modules.myModule).toBeInstanceOf(MyModule);
      expect(Object.keys(parser._modules).length).toBe(1);
    });
    it('spec modules override default modules', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        static defaultModules = {
          myModule: MyModule,
        };
        static specModules = {
          myModule: MySubModule,
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser._modules.myModule).toBeInstanceOf(MySubModule);
      expect(Object.keys(parser._modules).length).toBe(1);
    });
    it('only instantiates the overriding module', () => {
      const MyModule = jest.fn();
      const MySubModule = jest.fn();
      class MyCombatLogParser extends EmptyCombatLogParser {
        static defaultModules = {
          myModule: MyModule,
        };
        static specModules = {
          myModule: MySubModule,
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser.error).toBeFalsy();
      expect(MyModule.mock.instances.length).toBe(0);
      expect(MySubModule.mock.instances.length).toBe(1);
    });
    it('allows spec modules to disable default modules', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        static defaultModules = {
          myModule: MyModule,
        };
        static specModules = {
          myModule: null,
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser._modules.myModule).toBe(undefined);
      expect(Object.keys(parser._modules).length).toBe(0);
    });
  });
  describe('findModule', () => {
    it('finds a module by type', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        _modules = {
          alternative: {},
          test: myModule,
          another: {},
          onemore: {},
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser.findModule(MyModule)).toBe(parser._modules.test);
      expect(parser.findModule(MyModule)).toBeInstanceOf(MyModule);
      expect(parser.findModule(MyModule)).toBe(myModule);
    });
    it('finds a submodule even when looking for the parent module', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        _modules = {
          alternative: {},
          test: mySubModule,
          another: {},
          onemore: {},
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser.findModule(MyModule)).toBe(parser._modules.test);
      expect(parser.findModule(MyModule)).toBeInstanceOf(MySubModule);
      expect(parser.findModule(MyModule)).toBe(mySubModule);
      expect(parser.findModule(MySubModule)).toBeInstanceOf(MySubModule);
      expect(parser.findModule(MySubModule)).toBe(mySubModule);
    });
    it('returns undefined is module doesn\'t exist', () => {
      class MyCombatLogParser extends EmptyCombatLogParser {
        _modules = {
          onemore: {},
        };
      }
      const parser = new MyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(parser.findModule(MyModule)).toBe(undefined);
    });
  });
  describe('module dependencies', () => {
    it('loads a module without dependencies and reveals it under the `modules` property', () => { // this is more or less just a test whether our test method actually works
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      expect(Object.keys(parser._modules).length).toBe(0); // sanity check
      parser.initializeModules({
        myModule: MyModule,
      });
      expect(parser._modules.myModule).toBeInstanceOf(MyModule);
    });
    it('loads a module with a dependency', () => {
      class MyChildModule {
        static dependencies = {
          parent: MyModule,
        };
      }
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      parser.initializeModules({
        myModule: MyModule,
        myChildModule: MyChildModule,
      });
      expect(Object.keys(parser._modules).length).toBe(2);
      expect(parser._modules.myModule).toBeInstanceOf(MyModule);
      expect(parser._modules.myChildModule).toBeInstanceOf(MyChildModule);
    });
    it('delays loading a module until its dependencies are available', () => {
      class MyChildModule {
        static dependencies = {
          parent: MyModule,
        };
      }
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      parser.initializeModules({
        myChildModule: MyChildModule, // this requires MyModule, so loading this will have to be delayed
        myParentModule: MyModule,
      });
      expect(Object.keys(parser._modules).length).toBe(2);
      expect(parser._modules.myParentModule).toBeInstanceOf(MyModule);
      expect(parser._modules.myChildModule).toBeInstanceOf(MyChildModule);
    });
    it('throws when a module being depended on is not used by the CombatLogParser', () => {
      class MyChildModule {
        static dependencies = {
          parent: MyModule,
        };
      }
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      expect(() => {
        parser.initializeModules({
          myChildModule: MyChildModule,
        });
      }).toThrow('Failed to load modules: myChildModule');
    });
    it('recognizes classes that extend our dependency as valid dependencies', () => {
      class MyChildModule {
        static dependencies = {
          parent: MyModule,
        };
      }
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      parser.initializeModules({
        myModule: MySubModule,
        myChildModule: MyChildModule,
      });
      expect(Object.keys(parser._modules).length).toBe(2);
      expect(parser._modules.myModule).toBeInstanceOf(MySubModule);
      expect(parser._modules.myChildModule).toBeInstanceOf(MyChildModule);
    });
    it('passes the dependencies as a prop to the module', () => {
      const MyChildModule = jest.fn();
      MyChildModule.dependencies = {
        parent: MyModule,
      };
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      parser.initializeModules({
        myModule: MyModule,
        myChildModule: MyChildModule,
      });
      expect(parser._modules.myChildModule.parent).toBeInstanceOf(MyModule);
    });
    it('automatically prioritizes execution order of modules based on dependency requirements', () => {
      const MyAlternativeModule = jest.fn();
      const MyParentModule = jest.fn();
      const MyChildModule = jest.fn();
      MyChildModule.dependencies = {
        parent: MyParentModule,
      };
      const parser = new EmptyCombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants, null);
      parser.initializeModules({
        myAlternativeModule: MyAlternativeModule,
        myChildModule: MyChildModule, // this requires MyModule, so loading this will have to be delayed
        myParentModule: MyParentModule,
      });
      // 2 = priority
      expect(parser._modules.myAlternativeModule.priority).toBe(0);
      expect(parser._modules.myParentModule.priority).toBe(1);
      expect(parser._modules.myChildModule.priority).toBe(2);
    });
  });
  describe('implementation', () => {
    it('has a default config that works', () => {
      const parser = new CombatLogParser(fakeReport, fakePlayer, fakeFight, fakeCombatants);
      expect(Object.keys(parser._modules).length).toBeGreaterThan(0);
    });
  });
});
