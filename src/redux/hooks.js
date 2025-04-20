import { useDispatch, useSelector } from "react-redux";

// Custom hooks for using Redux dispatch and selector
export const useAppDispatch = () => useDispatch();
  // Pass the selector function to the original useSelector
export const useAppSelector=(selector)=>useSelector(selector);