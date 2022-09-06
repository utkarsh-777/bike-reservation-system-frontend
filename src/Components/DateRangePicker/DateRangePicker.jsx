import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { useEffect } from "react";

const DateRangePickerComponent = (props) => {
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: props.startDate,
      endDate: props.endDate,
      key: "selection",
    },
  ]);

  useEffect(() => {
    setSelectionRange([
      {
        startDate: props.startDate,
        endDate: props.endDate,
        key: "selection",
      },
    ]);
  }, [props.startDate, props.endDate]);

  const handleSelect = (range) => {
    setSelectionRange(range);
    props.setStartDate(range[0].startDate);
    props.setEndDate(range[0].endDate);
  };

  return (
    <div className="container text-center">
      <DateRange
        onChange={(range) => handleSelect([range.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        ranges={selectionRange}
        direction="horizontal"
      />
      {props.buttonText && (
        <div>
          <button
            className="btn btn-outline-dark mt-2 w-50"
            onClick={() => props.func()}
            disabled={selectionRange[0] === null}
          >
            {props.buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangePickerComponent;
