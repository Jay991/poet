import { fetchReducer } from './FetchReducer';
import ModalsReducer from './ModalsReducer';
import SessionReducer from './SessionReducer';
import ProfileReducer from './ProfileReducer';
import ClaimSign from './ClaimSignReducer';
import BlockReducer from './BlockReducer';
import SignTxReducer from './SignTxReducer';
import TransferReducer from './TransferReducer';

export default {
  fetch: fetchReducer,
  modals: ModalsReducer,
  session: SessionReducer,
  profile: ProfileReducer,
  signTx: SignTxReducer,
  transfer: TransferReducer,
  claimSign: ClaimSign,
  blocks: BlockReducer
};