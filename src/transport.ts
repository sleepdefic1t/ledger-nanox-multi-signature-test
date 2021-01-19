import LedgerTransport from '@ledgerhq/hw-transport-node-hid'
import { ARKTransport } from '@arkecosystem/ledger-transport'

export async function createARKTransport(): Promise<ARKTransport> {
    const transport = await LedgerTransport.create();
    return new ARKTransport(transport);
}
