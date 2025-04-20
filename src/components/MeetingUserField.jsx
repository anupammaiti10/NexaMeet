import React from "react";

function MeetingUserField({
  label,
  isInValid,
  error,
  placeholder,
  options,
  onChange,
  selectedOptions,
  isMultiUser,
}) {
  const selectUserFunction = (e) => {
    const selectUser = e.target.value;
    const selectedOption = options.find((ops) => ops.label === selectUser);
    onChange(selectedOption ? [selectUser] : []);
  };
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          className={`w-full px-4 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
            isInValid
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          value={selectedOptions[0]}
          onChange={selectUserFunction}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        {isMultiUser && (
          <button
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-red-500"
            onClick={() => onChange([])}
          >
            &times;
          </button>
        )}
      </div>
      {isInValid && error?.length > 0 && (
        <ul className="mt-1 text-sm text-red-600 space-y-0.5">
          {error.map((msg, idx) => (
            <li key={idx}>• {msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetingUserField;
