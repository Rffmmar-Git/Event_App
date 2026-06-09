type Props = {
  category: string;
  setCategory: (
    value: string
  ) => void;
  location: string;
  setLocation: (
    value: string
  ) => void;
  categories: string[];
  locations: string[];
};

function EventFilter({
  category,
  setCategory,
  location,
  setLocation,
  categories,
  locations,
}: Props) {
  return (
    <>
      {/* CATEGORY FILTER */}
      <select
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "none",
        }}
      >
        <option value="all">
          Types of Event
        </option>

        {categories
          .filter(
            (cat) =>
              cat !== "all"
          )
          .map(
            (cat, index) => (
              <option
                key={index}
                value={cat}
              >
                {cat}
              </option>
            )
          )}
      </select>

      {/* LOCATION FILTER */}
      <select
        value={location}
        onChange={(e) =>
          setLocation(
            e.target.value
          )
        }
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "none",
        }}
      >
        <option value="all">
          Location
        </option>

        {locations
          .filter(
            (loc) =>
              loc !== "all"
          )
          .map(
            (loc, index) => (
              <option
                key={index}
                value={loc}
              >
                {loc}
              </option>
            )
          )}
      </select>
    </>
  );
}

export default EventFilter;