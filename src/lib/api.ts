import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getDonghuaOngoing = async (page = 1) => {
  const res = await api.get(`/donghua/ongoing?page=${page}`);
  return res.data;
};

export const getAnimeOngoing = async (page = 1) => {
  const res = await api.get(`/anime/ongoing?page=${page}`);
  return res.data;
};

export const getDonghuaCompleted = async (page = 1) => {
  const res = await api.get(`/donghua/completed?page=${page}`);
  return res.data;
};

export const searchAnime = async (query: string, page = 1, mode = 'donghua') => {
  const res = await api.get(`/search`, { params: { q: query, page, mode } });
  return res.data;
};

export const getDetail = async (slug: string, mode = 'donghua') => {
  const res = await api.get(`/detail/${slug}`, { params: { mode } });
  return res.data;
};

export const getEpisode = async (slug: string, mode = 'donghua') => {
  const res = await api.get(`/episode/${slug}`, { params: { mode } });
  return res.data;
};
