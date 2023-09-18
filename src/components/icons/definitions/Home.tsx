import { Icon } from "..";

export const Home: Icon = ({ color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z"></path>
    <path d="M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
    <path d="M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6"></path>
  </svg>
);
