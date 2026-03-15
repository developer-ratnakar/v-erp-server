export const getPagination = (query) => {
  const page = Math.max(Number.parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit ?? "10", 10) || 10, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return {
    page,
    limit,
    from,
    to,
  };
};
