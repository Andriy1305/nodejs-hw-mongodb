const parseSortBy = (value) => {
  if (typeof value === 'undefined') {
    return '_id';
  }
  const keys = ['_id', 'name', 'year', 'createdAt'];

  if (!keys.includes(value)) {
    return '_id';
  }
  return value;
};

const parseSortOrder = (value) => {
  if (typeof value === 'undefined') {
    return 'asc';
  }
  return value === 'asc' || value === 'desc' ? value : 'asc';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
