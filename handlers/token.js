const stellar = require("stellar-sdk");
const { SERVER_KEY_PAIR } = require("../config.js");

module.exports = (req, res) => {
  const tx = new stellar.Transaction(req.body.transaction);

  const { signatures } = tx;
  const hash = tx.hash();

  let valid = [];

  // We verify that source account is ours.
  valid << tx.source == SERVER_KEY_PAIR.publicKey();

  // We verify that challenge transaction was generated by us.
  valid << signatures.some(signature =>
    SERVER_KEY_PAIR.verify(hash, signature.signature())
  );

  valid << tx.timeBounds
    && Date.now() > Number.parseInt(tx.timeBounds.timeMin, 10)
    && Date.now() < Number.parseInt(tx.timeBounds.timeMax, 10);

  console.log(tx);

  res.json("ok");
};

// const keypair = stellar.Keypair.fromPublicKey(tx.source);
//
// const { signatures } = tx;
// const hash = tx.hash();
//
// if (!signatures || signatures.length === 0) {
//   return false;
// }
//
// return signatures.some(signature =>
//   keypair.verify(hash, signature.signature())
// );
