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
  const safeSelectedOptions = Array.isArray(selectedOptions)
    ? selectedOptions
    : [];
  const selectUserFunction = (e) => {
    const selectUser = e.target.value;
    let newSelectedOptions;
    if (!isMultiUser) {
      newSelectedOptions = [selectUser];
    } else {
      newSelectedOptions = [...safeSelectedOptions];
      newSelectedOptions.push(selectUser);
      // if (!newSelectedOptions.includes(selectUser)) {
      // }
    }
    onChange(newSelectedOptions);
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
          value={selectedOptions?.[0]}
          onChange={selectUserFunction}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      {safeSelectedOptions?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {safeSelectedOptions.map((option, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
            >
              <span>{option}</span>
              {isMultiUser && (
                <button
                  className="ml-1 text-blue-500 hover:text-red-500"
                  onClick={() => {
                    const newSelected = selectedOptions.filter(
                      (_, i) => i !== idx
                    );
                    onChange(newSelected);
                  }}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isInValid && error?.length > 0 && (
        <ul className="mt-1 text-sm text-red-600 space-y-0.5">
          {error.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeetingUserField;
