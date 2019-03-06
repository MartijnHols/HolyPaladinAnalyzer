import SPECS from 'game/SPECS';
import RACES from 'game/RACES';
import TALENT_ROWS from 'game/TALENT_ROWS';
import GEAR_SLOTS from 'game/GEAR_SLOTS';
import traitIdMap from 'common/TraitIdMap';
import SPELLS from 'common/SPELLS';
import { findByBossId } from 'raids/index';
import Entity from './Entity';

class Combatant extends Entity {
  get id() {
    return this._combatantInfo.sourceID;
  }
  get name() {
    return this._combatantInfo.name;
  }
  get specId() {
    return this._combatantInfo.specID;
  }
  get spec() {
    return SPECS[this.specId];
  }
  get race() {
    if (!this.owner.characterProfile) {
      return null;
    }
    const raceId = this.owner.characterProfile.race;
    let race = Object.values(RACES).find(race => race.id === raceId);
    if (!this.owner.boss) {
      return race;
    }
    const boss = findByBossId(this.owner.boss.id);
    if (boss && boss.fight.raceTranslation) {
      race = boss.fight.raceTranslation(race, this.spec);
    }
    return race;
  }
  get characterProfile() {
    return this.owner.characterProfile;
  }

  _combatantInfo = null;
  constructor(parser, combatantInfo) {
    super(parser);

    const playerInfo = parser.players.find(player => player.id === combatantInfo.sourceID);
    this._combatantInfo = {
      // In super rare cases `playerInfo` can be undefined, not taking this into account would cause the log to be unparsable
      name: playerInfo && playerInfo.name,
      ...combatantInfo,
    };

    this._parseTalents(combatantInfo.talents);
    this._parseTraits(combatantInfo.artifact);
    this._parseGear(combatantInfo.gear);
    this._parsePrepullBuffs(combatantInfo.auras);
  }

  // region Talents
  _talentsByRow = {};
  _parseTalents(talents) {
    talents.forEach(({ id }, index) => {
      this._talentsByRow[index] = id;
    });
  }
  get talents() {
    return Object.values(this._talentsByRow);
  }
  _getTalent(row) {
    return this._talentsByRow[row];
  }
  get lv15Talent() {
    return this._getTalent(TALENT_ROWS.LV15);
  }
  get lv30Talent() {
    return this._getTalent(TALENT_ROWS.LV30);
  }
  get lv45Talent() {
    return this._getTalent(TALENT_ROWS.LV45);
  }
  get lv60Talent() {
    return this._getTalent(TALENT_ROWS.LV60);
  }
  get lv75Talent() {
    return this._getTalent(TALENT_ROWS.LV75);
  }
  get lv90Talent() {
    return this._getTalent(TALENT_ROWS.LV90);
  }
  get lv100Talent() {
    return this._getTalent(TALENT_ROWS.LV100);
  }
  hasTalent(spell) {
    const spellId = spell instanceof Object ? spell.id : spell;
    return !!Object.keys(this._talentsByRow).find(row => this._talentsByRow[row] === spellId);
  }
  // endregion

  // region Traits
  traitsBySpellId = {};
  _parseTraits(traits) {
    traits.forEach(({ traitID, rank }) => {
      const spellId = traitIdMap[traitID];
      if (spellId === undefined) {
        return;
      }
      if (!this.traitsBySpellId[spellId]) {
        this.traitsBySpellId[spellId] = [];
      }
      this.traitsBySpellId[spellId].push(rank);
    });
  }
  hasTrait(spellId) {
    return !!this.traitsBySpellId[spellId];
  }
  traitRanks(spellId) {
    return this.traitsBySpellId[spellId];
  }
  // endregion

  // region Gear
  _gearItemsBySlotId = {};
  _parseGear(gear) {
    gear.forEach((item, index) => {
      this._gearItemsBySlotId[index] = item;
    });
  }
  _getGearItemBySlotId(slotId) {
    return this._gearItemsBySlotId[slotId];
  }
  get gear() {
    return Object.values(this._gearItemsBySlotId);
  }
  get head() {
    return this._getGearItemBySlotId(GEAR_SLOTS.HEAD);
  }
  hasHead(itemId) {
    return this.head && this.head.id === itemId;
  }
  get neck() {
    return this._getGearItemBySlotId(GEAR_SLOTS.NECK);
  }
  hasNeck(itemId) {
    return this.neck && this.neck.id === itemId;
  }
  get shoulder() {
    return this._getGearItemBySlotId(GEAR_SLOTS.SHOULDER);
  }
  hasShoulder(itemId) {
    return this.shoulder && this.shoulder.id === itemId;
  }
  get back() {
    return this._getGearItemBySlotId(GEAR_SLOTS.BACK);
  }
  hasBack(itemId) {
    return this.back && this.back.id === itemId;
  }
  get chest() {
    return this._getGearItemBySlotId(GEAR_SLOTS.CHEST);
  }
  hasChest(itemId) {
    return this.chest && this.chest.id === itemId;
  }
  get wrists() {
    return this._getGearItemBySlotId(GEAR_SLOTS.WRISTS);
  }
  hasWrists(itemId) {
    return this.wrists && this.wrists.id === itemId;
  }
  get hands() {
    return this._getGearItemBySlotId(GEAR_SLOTS.HANDS);
  }
  hasHands(itemId) {
    return this.hands && this.hands.id === itemId;
  }
  get waist() {
    return this._getGearItemBySlotId(GEAR_SLOTS.WAIST);
  }
  hasWaist(itemId) {
    return this.waist && this.waist.id === itemId;
  }
  get legs() {
    return this._getGearItemBySlotId(GEAR_SLOTS.LEGS);
  }
  hasLegs(itemId) {
    return this.legs && this.legs.id === itemId;
  }
  get feet() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FEET);
  }
  hasFeet(itemId) {
    return this.feet && this.feet.id === itemId;
  }
  get finger1() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FINGER1);
  }
  get finger2() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FINGER2);
  }
  getFinger(itemId) {
    if (this.finger1 && this.finger1.id === itemId) {
      return this.finger1;
    }
    if (this.finger2 && this.finger2.id === itemId) {
      return this.finger2;
    }

    return undefined;
  }
  hasFinger(itemId) {
    return this.getFinger(itemId) !== undefined;
  }
  get trinket1() {
    return this._getGearItemBySlotId(GEAR_SLOTS.TRINKET1);
  }
  get trinket2() {
    return this._getGearItemBySlotId(GEAR_SLOTS.TRINKET2);
  }
  getTrinket(itemId) {
    if (this.trinket1 && this.trinket1.id === itemId) {
      return this.trinket1;
    }
    if (this.trinket2 && this.trinket2.id === itemId) {
      return this.trinket2;
    }

    return undefined;
  }
  hasTrinket(itemId) {
    return this.getTrinket(itemId) !== undefined;
  }
  hasMainHand(itemId) {
    return this.mainHand && this.mainHand.id === itemId;
  }
  get mainHand() {
    return this._getGearItemBySlotId(GEAR_SLOTS.MAINHAND);
  }
  hasOffHand(itemId) {
    return this.offHand && this.offHand.id === itemId;
  }
  get offHand() {
    return this._getGearItemBySlotId(GEAR_SLOTS.OFFHAND);
  }
  getItem(itemId) {
    return Object.keys(this._gearItemsBySlotId)
      .map(key => this._gearItemsBySlotId[key])
      .find(item => item.id === itemId);
  }
  // endregion

  _parsePrepullBuffs(buffs) {
    // TODO: We only apply prepull buffs in the `auras` prop of combatantinfo, but not all prepull buffs are in there and ApplyBuff finds more. We should update ApplyBuff to add the other buffs to the auras prop of the combatantinfo too (or better yet, make a new normalizer for that).
    const timestamp = this.owner.fight.start_time;
    buffs.forEach(buff => {
      const spell = SPELLS[buff.ability];
      this.applyBuff({
        ability: {
          abilityIcon: buff.icon.replace('.jpg', ''),
          guid: buff.ability,
          name: spell ? spell.name : undefined,
        },
        sourceID: buff.source,
        start: timestamp,
      });
    });
  }
}

export default Combatant;
