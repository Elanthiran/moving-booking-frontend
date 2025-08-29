import React from "react";
import { useSelector } from "react-redux";
import Theatre from "./Theatre";

const BookTickets = () => {
  const selectedCity = useSelector((state) => state.theatres.selectedCity);
  const theatres = useSelector((state) => state.theatres.theatres) || [];

  if (!selectedCity) {
    return <p>Please select a city to see theatres.</p>;
  }

  // Filter theatres that belong to the selected city
  const theatresInCity = theatres.filter(
    (theatre) =>
      theatre.name?.toLowerCase() === selectedCity.name.toLowerCase()
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Theatres in {selectedCity.name}</h2>
      {theatresInCity.length === 0 ? (
        <p>No theatres found in this city.</p>
      ) : (
        <Theatre filteredTheatres={theatresInCity} />
      )}
    </div>
  );
};

export default BookTickets;
