/**
 * @deprecated Use Checklist2 instead.
 */
class Requirement {
  name = null;
  check = null;
  when = null;
  tooltip = null;
  valueTooltip = null;
  constructor(options) {
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    });
  }
}

export default Requirement;
