const mongoose = require("mongoose");

const findVoterIndex = (voters, userId) =>
  voters.findIndex((v) => v.userId.toString() === userId.toString());

exports.applyVote = ({ doc, userId, authorId, voteValue }) => {
  if (authorId.toString() === userId.toString()) {
    return {
      ok: false,
      status: 403,
      message: "Ma codeyn kartid content-kaaga.",
    };
  }

  const voters = doc.voters || [];
  const index = findVoterIndex(voters, userId);
  let message = "";

  if (index === -1) {
    voters.push({
      userId: new mongoose.Types.ObjectId(userId),
      value: voteValue,
    });
    doc.votes += voteValue;
    message =
      voteValue === 1 ? "Waad upvote-gareysay" : "Waad downvote-gareysay";
  } else if (voters[index].value === voteValue) {
    voters.splice(index, 1);
    doc.votes -= voteValue;
    message =
      voteValue === 1
        ? "Waad ka laabatay upvote-kii"
        : "Waad ka laabatay downvote-kii";
  } else {
    doc.votes += voteValue * 2;
    voters[index].value = voteValue;
    message =
      voteValue === 1 ? "Waad u beddeshay upvote" : "Waad u beddeshay downvote";
  }

  doc.voters = voters;
  return { ok: true, message };
};
