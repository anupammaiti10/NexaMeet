import React from "react";

function DateField({ label, date,setDateValue }) {
    const handleDateValue=(e)=>{
        const selectedDate = e.target.value;
        setDateValue(selectedDate);
    }
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="date"
        value={date}
        onChange={handleDateValue}
        className="w-full px-4 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default DateField;
