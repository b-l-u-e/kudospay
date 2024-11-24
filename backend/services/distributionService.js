const { TransferTransaction, Hbar } = require("@hashgraph/sdk");
const { teamPoolClient } = require("../config/client")

// Function to distribute a tip among team members with precision handling
exports.distributeTeamTip = async (teamPoolId, teamMembers, totalAmount) => {
  // Remove duplicate team members by creating a Set
  const uniqueTeamMembers = [...new Set(teamMembers)];

  // Calculate the equal amount each member should receive
  const individualAmount = Math.floor(totalAmount / uniqueTeamMembers.length); // Ensure integer division
  const totalDistributed = individualAmount * uniqueTeamMembers.length;
  const remainder = totalAmount - totalDistributed; // Calculate any leftover amount

  for (let i = 0; i < uniqueTeamMembers.length; i++) {
    const member = uniqueTeamMembers[i];
    let amountToTransfer = individualAmount;

    // Add the remainder to the last member's transfer to ensure full distribution
    if (i === uniqueTeamMembers.length - 1) {
      amountToTransfer += remainder;
    }

    const transaction = await new TransferTransaction()
      .addHbarTransfer(teamPoolId, new Hbar(-amountToTransfer))
      .addHbarTransfer(member, new Hbar(amountToTransfer))
      .execute(teamPoolClient);

    const receipt = await transaction.getReceipt(teamPoolClient);

    // Check if transaction was successful
    if (receipt.status.toString() !== "SUCCESS") {
      throw new Error(`Failed to distribute to team member ${member}`);
    }
  }
  return "SUCCESS";
};
