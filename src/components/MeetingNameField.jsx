import React from "react";

function MeetingNameField({
  label,
  placeholder,
  value,
  isInValid,
  error,
  setMeetingName,
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}                       
        value={value}                                   
        onChange={(e) => {
          setMeetingName(e.target.value);
        }}
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          isInValid
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {isInValid && error?.length && (
        <ul>
          {error.map((err, index) => (
            <li key={index}>err</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetingNameField;
