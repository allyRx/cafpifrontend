import api from '../lib/api';

export const exportUserData = async () => {
  const response = await api.post('/user/export');
  return response.data;
};

export const deleteUserAccount = async () => {
  const response = await api.delete('/user');
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await api.post('/user/change-password', data);
  return response.data;
}

export const updateUserProfile = async (data: any) => {
  const response = await api.put('/user/profile', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};
