import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import moment from "moment";

const DateTimeRangeView = (props) => {
  let now = new Date();

  let start = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
  );
  let end = moment(start).add(1, "days").subtract(1, "seconds");
  const applyCallback = (start_date, end_date) => {
    props.setStartDate(start_date._d);
    props.setEndDate(end_date._d);
    return props.setSelectedDate(
      start_date._d.toLocaleString() + " TO " + end_date._d.toLocaleString(),
    );
  };
  let ranges = {
    "Today Only": [moment(start), moment(end)],
    "Yesterday Only": [
      moment(start).subtract(1, "days"),
      moment(end).subtract(1, "days"),
    ],
    "3 Days": [moment(start).subtract(3, "days"), moment(end)],
  };
  let local = {
    format: "DD-MM-YYYY HH:mm",
    sundayFirst: false,
  };

  return (
    <div className="mb-2">
      <DateTimeRangeContainer
        start={start}
        end={end}
        local={local}
        ranges={ranges}
        applyCallback={applyCallback}
      >
        <input
          className="form-control"
          id="formControlsTextB"
          type="text"
          label="Text"
          placeholder="Enter Date"
          value={props.selectedDate}
        />
      </DateTimeRangeContainer>
      {props.text && (
        <button
          className="btn btn-secondary mt-2"
          onClick={() => props.func()}
          disabled={props.selectedDate === null}
        >
          {props.text}
        </button>
      )}
    </div>
  );
};

export default DateTimeRangeView;
