import apiClient from '@/lib/apiClient';
import { Category } from '@/types';
import { catchError } from '@/utils/catchError';

const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await apiClient.get(`/api/categories`);

    return data.data;
  } catch (error) {
    console.error('Raw error from API call:', error); // Log the raw error
    throw new Error(catchError(error));
  }
};

const CategoryService = {
  getCategories,
};

export default CategoryService;
