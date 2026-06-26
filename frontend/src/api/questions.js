import api from "./axios";

export const getAllQuestions = (params) => api.get("/question", { params });

export const getSingleQuestion = (id) => api.get(`/question/${id}`);

export const createQuestion = (payload) => api.post("/question", payload);

export const upvoteQuestion = (id) => api.put(`/question/${id}/upvote`);

export const downvoteQuestion = (id) => api.put(`/question/${id}/downvote`);

export const acceptAnswer = (questionId, answerId) =>
  api.put(`/question/${questionId}/accept/${answerId}`);

export const getTagsList = () => api.get("/question/tags/list");

export const deleteQuestion = (id) => api.delete(`/question/${id}`);
