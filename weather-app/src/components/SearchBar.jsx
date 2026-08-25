function SearchBar({ city, setCity, onSearch, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button onClick={onSearch} disabled={disabled || !city.trim()}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;