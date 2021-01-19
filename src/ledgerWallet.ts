import { Identities, Utils } from "@arkecosystem/crypto"
import { ADN_HD_PATH, ADN_VERSION, getConnectionADN } from './connection'

export async function getLedgerPublicKey(arkTransport: any): Promise<string> {
    const ledgerPublicKeyStr = await arkTransport.getPublicKey(ADN_HD_PATH)
        .catch((e: Error) => console.error(e));

    console.log('\nLedger PublicKey: ', ledgerPublicKeyStr, '\n');
    return ledgerPublicKeyStr;
}

export async function getLedgerAddress(ledgerPublicKey: string): Promise<string> {
    const ledgerAddressStr = Identities.Address.fromPublicKey(ledgerPublicKey, ADN_VERSION);
    console.log('\nLedger Address: ', ledgerAddressStr, '\n');
    return ledgerAddressStr;
}

export async function getLedgerWalletNextNonce(ledgerAddress: string): Promise<string> {
    const senderWallet = await getConnectionADN()
        .then(async (client: any) => await client.api("wallets").get(ledgerAddress))
        .catch((e: Error) => console.error(e));

    const senderNonce = Utils.BigNumber.make(senderWallet.body.data.nonce).plus(1);
    console.log('\nLedger Nonce: ', senderNonce.toString(), '\n');
    return senderNonce.toFixed();
}

export async function getLedgerWalletCurrentVote(ledgerAddress: string): Promise<string> {
    const senderWallet = await getConnectionADN()
        .then(async (client: any) => await client.api("wallets").get(ledgerAddress))
        .catch((e: Error) => console.error(e));

    const currentVote = senderWallet.body.data.attributes.vote;
    console.log('\nLedger Current Vote: ', currentVote, '\n');
    return currentVote;
}

export async function getLedgerSignature(arkTransport: any, payload: Buffer): Promise<string> {
    const signature = await arkTransport.signTransactionWithSchnorr(ADN_HD_PATH, payload)
        .catch((e: Error) => console.error(e));

    console.log('\nLedger Signature: ', signature.toString(), '\nfor payload: ', payload.toString('hex'), '\n');
    return signature;
}
