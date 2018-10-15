import { SET_COMBATANTS } from 'interface/actions/combatants';
import { SET_REPORT } from 'interface/actions/report';

export default function combatants(state = null, action) {
  switch (action.type) {
    case SET_REPORT:
      return null;
    case SET_COMBATANTS:
      return action.payload;
    default:
      return state;
  }
}
