import api from "./axios";

export const createAnswer = (questionId, body) =>
  api.post(`/answer/${questionId}/create-answer`, { body });

export const upvoteAnswer = (answerId) =>
  api.put(`/answer/${answerId}/upvote`);

export const downvoteAnswer = (answerId) =>
  api.put(`/answer/${answerId}/downvote`);
