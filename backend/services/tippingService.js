const { TransferTransaction, Hbar } = require("@hashgraph/sdk");
const { client } = require("../config/client");
const Tip = require("../models/tipModel");

// Function to send an individual tip
exports.sendIndividualTip = async (guestId, staffId, amount) => {
  const transaction = await new TransferTransaction()
    .addHbarTransfer(guestId, new Hbar(-amount))
    .addHbarTransfer(staffId, new Hbar(amount))
    .execute(client);

  const receipt = await transaction.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save transaction to MongoDB
    const tip = new Tip({ guestId, staffId, amount, isTeamTip: false });
    await tip.save();
  }

  return receipt.status;
};

exports.sendTeamTip = async (guestId, teamPoolId, amount) => {
  const transaction = await new TransferTransaction()
    .addHbarTransfer(guestId, new Hbar(-amount))
    .addHbarTransfer(teamPoolId, new Hbar(amount))
    .execute(client);

  const receipt = await transaction.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save team tip in MongoDB with teamPoolId and isTeamTip set to true
    const tip = new Tip({
      guestId,
      staffId: teamPoolId,
      amount,
      teamPoolId,
      isTeamTip: true,
    });
    await tip.save();
  }
  return receipt.status;
};
