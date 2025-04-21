export const fetchInsights = async (endpoint: string = '/api/insights') => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchInsights:', error);
    throw error;
  }
};
