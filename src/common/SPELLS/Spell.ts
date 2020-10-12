export default interface Spell {
    id: number;
    name: string;
    icon: string;
    resourceCost?: number;
    manaCost?: number;
    castTime?: number;
};

export interface ShamanSpell extends Spell{
    maelstrom?: number;
    max_maelstrom?: number;
    coefficient?: number;
    color?: string;
}

export interface LegendarySpell extends Spell {
  bonusID?: number;
}

export interface SpellList<T extends Spell = Spell> {
  [key: string]: T
}
