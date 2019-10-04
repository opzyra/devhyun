export const pagination = (rowCount, limit, page) => {
  let totalPages = Math.floor(rowCount / limit);
  if (rowCount % limit > 0) totalPages++;
  return {
    rowCount,
    totalPages,
    page
  };
};
