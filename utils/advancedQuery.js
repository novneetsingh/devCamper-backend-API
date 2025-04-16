exports.advancedQuery = (queryParams) => {
  const filters = {};

  // Extract and remove non-filter fields
  const { select, sort, page, limit, ...rest } = queryParams;

  for (let key in rest) {
    const value = rest[key];

    const match = key.match(/^(.+)\[(gt|gte|lt|lte|in)\]$/);
    if (match) {
      const field = match[1];
      const operator = `$${match[2]}`;
      const parsedValue =
        match[2] === "in"
          ? value.split(",") // turn "a,b,c" into [a, b, c]
          : isNaN(value)
          ? value
          : Number(value);

      if (!filters[field]) filters[field] = {};

      // e.g. averageCost[lte]=20000
      // filters = {
      //   averageCost: { $lte: 20000 },
      // }
      filters[field][operator] = parsedValue;
    } else {
      // e.g. name=John Doe
      // filters = {
      //   name: "John Doe",
      // }
      filters[key] = isNaN(value) ? value : Number(value);
    }
  }

  return {
    filter: filters,
    select: select ? select.split(",").join(" ") : undefined,
    sort: sort ? sort.split(",").join(" ") : undefined,
    skip: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 25),
    limit: parseInt(limit) || 25,
  };
};
