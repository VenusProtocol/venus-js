import { CompoundInstance } from './types';

/**
 * This function acts like a decorator for all methods that interact with the
 *     blockchain. In order to use the correct Venus Protocol addresses, the
 *     Venus.js SDK must know which network its provider points to. This
 *     function holds up a transaction until the main constructor has determined
 *     the network ID.
 *
 * @hidden
 *
 * @param {Venus} _compound The instance of the Venus.js SDK.
 *
 */
export async function netId(_compound: CompoundInstance): Promise<void> {
  if (_compound._networkPromise) {
    await _compound._networkPromise;
  }
}
