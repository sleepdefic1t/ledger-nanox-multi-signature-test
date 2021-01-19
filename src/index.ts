
import { createARKTransport } from './transport'
import {
    getLedgerPublicKey,
    getLedgerAddress,
    getLedgerWalletNextNonce,
    getLedgerSignature,
} from './ledgerWallet'
import {
    getMultiSigTxBase,
    getMultiSigTransferBase,
    getSigningPayload,
    addParticipantSignature,
    addTransferParticipantSignature,
    addFinalSignature,
    getTransferSigningPayload,
    finalizeTransfer
} from './multisignature'
import { sendTransactionADN } from './connection';

async function testNonParticipant() {
    console.log("\n===== Testing Non-Participant Ledger MultiSignature Registration =====\n")
    const arkTransport = await createARKTransport();

    const ledgerPublicKey = await getLedgerPublicKey(arkTransport);
    const ledgerAddress = await getLedgerAddress(ledgerPublicKey);
    const ledgerNonce = await getLedgerWalletNextNonce(ledgerAddress);

    const baseTx = await getMultiSigTxBase(ledgerPublicKey, ledgerNonce, false);

    const finalLedgerSignature = await getLedgerSignature(
        arkTransport,
        getSigningPayload(baseTx)
    );

    const finalTx = addFinalSignature(baseTx, finalLedgerSignature);

    await sendTransactionADN(finalTx);
    console.log("\n==================================================================\n")
}

async function testParticipant() {
    console.log("\n===== Testing Participant Ledger MultiSignature Registration =====\n")
    const arkTransport = await createARKTransport();

    const ledgerPublicKey = await getLedgerPublicKey(arkTransport);
    const ledgerAddress = await getLedgerAddress(ledgerPublicKey);
    const ledgerNonce = await getLedgerWalletNextNonce(ledgerAddress);

    const baseTx = await getMultiSigTxBase(ledgerPublicKey, ledgerNonce, true);

    const participantSignature = await getLedgerSignature(
        arkTransport,
        getSigningPayload(baseTx)
    );

    const preparedTx = addParticipantSignature(baseTx, participantSignature, ledgerPublicKey);

    const finalLedgerSignature = await getLedgerSignature(
        arkTransport,
        getSigningPayload(preparedTx)
    );

    const finalTx = addFinalSignature(baseTx, finalLedgerSignature);

    await sendTransactionADN(finalTx);
    console.log("\n==================================================================\n")
}

async function testTransfer() {
    console.log("\n===== Testing Participant Ledger MultiSignature Transfer =====\n")
    const arkTransport = await createARKTransport();

    const ledgerPublicKey = await getLedgerPublicKey(arkTransport);

    const baseTx = await getMultiSigTransferBase(ledgerPublicKey);

    const participantSignature = await getLedgerSignature(
        arkTransport,
        getTransferSigningPayload(baseTx)
    );

    const preparedTx = addTransferParticipantSignature(baseTx, participantSignature, ledgerPublicKey);

    const finalTx = finalizeTransfer(preparedTx);

    await sendTransactionADN(finalTx);
    console.log("\n==================================================================\n")
}

async function main() {
    // await testNonParticipant();
    // await testParticipant();
    // await testTransfer();
}

main();
