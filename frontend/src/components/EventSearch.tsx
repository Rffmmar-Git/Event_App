type Props = {
  search: string;
  setSearch: (
    value: string
  ) => void;
};

function EventSearch({
  search,
  setSearch,
}: Props) {
  return (
    <>
      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search events"
      />
    </>
  );
}

export default EventSearch;