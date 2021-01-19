# ledger-nanox-multi-signature-test
 Ledger NanoX MultiSignature Test Project

*\*\*NOT FOR PRODUCTION!\*\**

1) connect Ledger
   - connection via USB
   - unlock with device pin
   - open the ARK Ledger App
2) Install & Run this project
   - `yarn && yarn start`

## To select a demo

Edit the ./src/index.ts file's `main` function.

Uncomment each one individually to try it out.

```typescript
async function main() {
    // await testNonParticipant();
    // await testParticipant();
    // await testTransfer();
}
```

### `testNonParticipant();`

Will register a multisignature registration on behalf of others.

### `testParticipant();`

Will register and participate in a multisignature registration along with others.

### `testTransfer();`

Will create and broadcast a MultiSignature Transfer based off the Participant registration address.

## Successful Transactions

Participants:
```json
{
    "participants": {
        "Participant_0": "this is a top secret passphrase 0",
        "Participant_1": "this is a top secret passphrase 1",
        "Ledger": "02cd217b9ca06dbd28e99be261e485b0c6c458765f433f6782a2cd24e9cbc4122c",
    },
    "address": {
        "MultiSignatureAddress": "DUS8ZoesBVA8ojaKGWJVj52RoXybnbBYPS"
    }
}
```

- MultiSignature Registration:
    - https://dexplorer.ark.io/transactions/e145dd27977f63423a33106ad2014a1c55cfe65d9164cccfc74ff6c743954c80

- MultiSignature Transfer
    -  https://dexplorer.ark.io/transactions/235b96599e5199e3bbc2324b5b47ac30cc0ec1c21624fb0c10b35346eefb9394
