const generateQuery = (filter = {}) => {
  const generatedQuery = {};

  if (filter.start_year && filter.end_year) {
    generatedQuery["car_model_year"] = {
      $gte: filter.start_year,
      $lte: filter.end_year,
    };
  }

  if (Array.isArray(filter.countries) && filter.countries.length > 0)
    generatedQuery["country"] = { $in: filter.countries };

  if (filter.gender)
    generatedQuery["gender"] =
      filter.gender.charAt(0).toUpperCase() + filter.gender.slice(1);

  if (Array.isArray(filter.colors) && filter.colors.length > 0)
    generatedQuery["car_color"] = { $in: filter.colors };

  return generatedQuery;
};

module.exports = generateQuery;
