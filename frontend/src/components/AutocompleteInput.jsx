import React, { useState, useEffect } from "react";

export default function AutocompleteInput({ value, onChange, fetcher, placeholder }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
    let ignore = false;

    const run = async () => {
        if (!query) {
        if (!ignore) setSuggestions([]);
        return;
        }

        const res = await fetcher(query);
        if (!ignore) setSuggestions(res);
    };

    const timeout = setTimeout(run, 200);

    return () => {
        ignore = true;
        clearTimeout(timeout);
    };
    }, [query, fetcher]);



  return (
    <div className="relative">
      <input
        className="border p-2 rounded w-full"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
      />

      {suggestions.length > 0 && (
        <div className="absolute bg-white border rounded shadow w-full max-h-40 overflow-auto z-10">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(item);
                onChange(item);
                setSuggestions([]);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
