/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#000000",
        primary: "#9D7CF2",
        secondary: "#F2E97C",
        tertiary: "#94ADF2",
        error: "#F27C7C",
        success: "#A5F27C",
      },
    },
  },
  plugins: [],
};

/**
 * 
 * :root {
  // --primary: #8d65f2;
  // --secondary: #F2E766;
  // --primary: #9D7CF2;
  // --secondary: #F2E97C;
  // --primary: #D3F27C;
  // --secondary: #CF7CF2;
  // --primary: #F27C7C;
  // --secondary: #7CF29D;
  --primary: #7CEEF2;
  --secondary: #F2AA7C;
}
 */
