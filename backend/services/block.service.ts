export const getBlocksList = async () => {
  // simulate a delay
  const data = await new Promise(resolve => setTimeout(() => resolve([]), 500))
  return data;
};
