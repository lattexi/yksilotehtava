const fetchData = async (url: string, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occurred`);
  }
  const json = await response.json();
  return json;
};

export { fetchData };