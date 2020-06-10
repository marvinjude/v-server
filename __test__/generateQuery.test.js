const generateQuery = require("../utils/generateQuery");

describe("the generateQuery function", () => {
  it("returns empty object when no argument is passed", () => {
    const query = generateQuery();

    expect(query).toEqual({});
  });

  it("returns empty object when an empty object is passed", () => {
    const query = generateQuery({});

    expect(query).toEqual({});
  });

  it("returns correct query when filter is passed", () => {
    const filter = {
      gender: "Male",
      countries: ["Togo", "Nigeria", "Ghana"],
      colors: ["Red", "Yellow", "Gold"],
      start_year: 2010,
      end_year: 2020,
    };
    const generatedQuery = generateQuery(filter);

    expect(generatedQuery).toEqual({
      gender: "Male",
      country: { $in: ["Togo", "Nigeria", "Ghana"] },
      car_color: { $in: ["Red", "Yellow", "Gold"] },
      car_model_year: {
        $gte: 2010,
        $lte: 2020,
      },
    });
  });

  it("returns only keys with truthy values", () => {
    const filter = {
      gender: "",
      countries: [],
      colors: ["Red", "Yellow", "Gold"],
    };
    const generatedQuery = generateQuery(filter);

    expect(generatedQuery).toEqual({
      car_color: { $in: ["Red", "Yellow", "Gold"] },
    });
  });

  it("doesn't return extra filter keys", () => {
    const filter = {
      colors: ["Red", "Yellow", "Gold"],
      x: "shouldn't be here",
    };
    const generatedQuery = generateQuery(filter);

    expect(generatedQuery).toEqual({
      car_color: { $in: ["Red", "Yellow", "Gold"] },
    });
  });
});
