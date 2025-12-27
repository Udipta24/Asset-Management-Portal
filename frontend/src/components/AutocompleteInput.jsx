import React, { useState, useEffect } from "react";

export default function AutocompleteInput({ value, onChange, fetcher, placeholder }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);

    //we use this as user types fast and previous result eg of "eve" come after i type "ever"
    //so api calls are async and return out of order
    //so we added timeout 200ms before showing menu
    //we make async function inside it as useEffect itself cannot be async
    //!query mean if no query then so no suggestion , empty array, query comes from onchange setquery inside form
    //here fetcher is like any function here that calls get request to functions in backend like
    //getUsers,getLocations,....etc.
    //

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

    //return() is a clean up function, it doesnt let old queries run 
    // by setting ignore true and clear the "timeout" from queue, only latest query runs
    //old query still finishes all of that,but no result.
  

    
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
                setSuggestions([]); //menu closes after clicking
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



//need to fix autocomplete, not fixed auto complete