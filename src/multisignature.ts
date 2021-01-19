const { Transactions, Identities } = require("@arkecosystem/crypto");

const MULTISIG_PARTICIPANT_MNEMONICS = [
    "this is a top secret passphrase 0",
    "this is a top secret passphrase 1",
];

const keys = [
    Identities.Keys.fromPassphrase(MULTISIG_PARTICIPANT_MNEMONICS[0]),
    Identities.Keys.fromPassphrase(MULTISIG_PARTICIPANT_MNEMONICS[1])
];

function getNonParticipantRegistration(
    ledgerPublicKey: string,
    ledgerWalletNonce: string
) {
    const multiSigAsset = {
        publicKeys: [
            keys[0].publicKey,
            keys[1].publicKey,
        ],
        min: 2,
    };

    const unfinished_transaction = Transactions.BuilderFactory.multiSignature()
        .version(2)
        .nonce(ledgerWalletNonce)
        .senderPublicKey(ledgerPublicKey)
        .multiSignatureAsset(multiSigAsset)
        .multiSignWithKeyPair(0, keys[0])
        .multiSignWithKeyPair(1, keys[1])
        .build();

    console.log('\nUnfinished Non-Participant Transaction: ',
        JSON.stringify(unfinished_transaction.toJson(), null, 4), '\n');

    return unfinished_transaction;
}

function getParticipantRegistration(
    ledgerPublicKey: string,
    ledgerWalletNonce: string
) {
    const keys = [
        Identities.Keys.fromPassphrase(MULTISIG_PARTICIPANT_MNEMONICS[0]),
        Identities.Keys.fromPassphrase(MULTISIG_PARTICIPANT_MNEMONICS[1])
    ];

    const multiSigAsset = {
        publicKeys: [
            keys[0].publicKey,
            keys[1].publicKey,
            ledgerPublicKey,
        ],
        min: 2,
    };

    const unfinished_transaction = Transactions.BuilderFactory.multiSignature()
        .version(2)
        .nonce(ledgerWalletNonce)
        .senderPublicKey(ledgerPublicKey)
        .multiSignatureAsset(multiSigAsset)
        .multiSignWithKeyPair(0, keys[0])
        .multiSignWithKeyPair(1, keys[1])
        .build();

    console.log('\nUnfinished Participant Transaction: ',
        JSON.stringify(unfinished_transaction.toJson(), null, 4), '\n');
    console.log('\nis Unfinished Participant TxValid?: ', unfinished_transaction.verify(), '\n');

    return unfinished_transaction;
}

export function getMultiSigTxBase(
    ledgerPublicKey: string,
    ledgerWalletNonce: string,
    isLedgerParticipating: Boolean
) {
    return isLedgerParticipating
        ? getParticipantRegistration(ledgerPublicKey, ledgerWalletNonce)
        : getNonParticipantRegistration(ledgerPublicKey, ledgerWalletNonce);
}

export async function getMultiSigTransferBase(
    ledgerPublicKey: string,
) {
    const multiSigAsset = {
        publicKeys: [
            keys[0].publicKey,
            keys[1].publicKey,
            ledgerPublicKey,
        ],
        min: 2,
    };

    const multiSigPublicKey = Identities.PublicKey.fromMultiSignatureAsset(multiSigAsset);
    const multiSigAddress = Identities.Address.fromMultiSignatureAsset(multiSigAsset);

    const unfinished_transaction = Transactions.BuilderFactory.transfer()
        .version(2)
        .nonce(1)
        .amount(1)
        .recipientId(multiSigAddress)
        .senderPublicKey(multiSigPublicKey)
        .multiSignWithKeyPair(0, keys[0])
        .multiSignWithKeyPair(1, keys[1])
        .build();


    console.log('\nUnfinished Transfer Transaction: ',
        JSON.stringify(unfinished_transaction.toJson(), null, 4), '\n');
    console.log('\nis Unfinished Transfer TxValid?: ', unfinished_transaction.verify(), '\n');

    return unfinished_transaction;
}


export function addTransferParticipantSignature(tx: any, signature: string, ledgerPublicKey: string): any {
    const multiSigAsset = {
        publicKeys: [
            keys[0].publicKey,
            keys[1].publicKey,
            ledgerPublicKey,
        ],
        min: 2,
    };
    const idx = multiSigAsset.publicKeys.indexOf(ledgerPublicKey);

    const idxString = idx.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    tx.data.signatures[idx] = idxString + signature;

    console.log('\nParticipant Signature \'[', idx, ']\': ', tx.data.signatures[idx], '\n');

    return tx;
}

export function finalizeTransfer(tx: any): any {
    // tx.data.signature = signature;
    tx.data.timestamp = Date.now();
    tx.data.id = Transactions.Utils.getId(tx.data).toString();

    console.log('\nSigned Transaction: ', JSON.stringify(tx.toJson(), null, 4), '\n');
    console.log('\nis Signed Tx Valid?: ', tx.verify(), '\n');

    return tx;
}

export function getTransferSigningPayload(tx: any) {

    const signingPayload = Transactions.Serializer.serialize(tx,
        { excludeSignature: true, excludeSecondSignature: true, excludeMultiSignature: true }
    );
    console.log('\nSigning Payload: ', signingPayload.toString('hex'), '\n');

    return signingPayload;
}

export function getSigningPayload(tx: any) {

    const signingPayload = Transactions.Serializer.serialize(tx,
        { excludeSignature: true, excludeSecondSignature: true }
    );
    console.log('\nSigning Payload: ', signingPayload.toString('hex'), '\n');

    return signingPayload;
}

export function addParticipantSignature(tx: any, signature: string, ledgerPublicKey: string): any {
    const idx = tx.data.asset.multiSignature.publicKeys.indexOf(ledgerPublicKey);
    const idxString = idx.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    tx.data.signatures[idx] = idxString + signature;

    console.log('\nParticipant Signature \'[', idx, ']\': ', tx.data.signatures[idx], '\n');

    return tx;
}

export function addFinalSignature(tx: any, signature: string): any {
    tx.data.signature = signature;
    tx.data.timestamp = Date.now();
    tx.data.id = Transactions.Utils.getId(tx.data).toString();

    console.log('\nSigned Transaction: ', JSON.stringify(tx.toJson(), null, 4), '\n');
    console.log('\nis Signed Tx Valid?: ', tx.verify(), '\n');

    return tx;
}
