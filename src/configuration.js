export const accessToken =
  process.env.NODE_ENV === "development"
    ? "pk.eyJ1IjoibWFyY29sYXJvc2EiLCJhIjoiY2trb3I1NHR4MDdvdTJ4cGh3YzU3eWZnZyJ9.h0IqZUqMx2sLoSQc5KM1Lg"
    : "pk.eyJ1IjoibmljaG9sYXN0IiwiYSI6ImNrbmR1OXZodTE2cmUyem1panB1bWduejUifQ.YJRyVbKg1AQ8Cf5vaYAiag";

// export const mapBoxStyle = "mapbox://styles/mapbox/light-v10";
export const mapBoxStyle =
  "mapbox://styles/marcolarosa/cky9kby0e5gt514rn8jx1xy9q";

export const resourceSteps = {
  default: [
    { count: 3, color: "#000000" },
    { count: 10, color: "#f03434" },
    { count: 100, color: "#eeee00" },
    { count: 500, color: "#e87e04" },
    { count: 500, color: "#00e640" },
  ],
  blue: [
    { count: 3, color: "#000000" },
    { count: 10, color: "#c5eff7" },
    { count: 100, color: "#00b5cc" },
    { count: 500, color: "#2c82c9" },
    { count: 500, color: "#01017a" },
  ],
  purple: [
    { count: 3, color: "#000000" },
    { count: 10, color: "#d5b8ff" },
    { count: 100, color: "#bf55ec" },
    { count: 500, color: "#a537fd" },
    { count: 500, color: "#8c14fc" },
  ],
  orange: [
    { count: 3, color: "#000000" },
    { count: 10, color: "#fdbe85" },
    { count: 100, color: "#f9b42d" },
    { count: 500, color: "#f9690e" },
    { count: 500, color: "#d35400" },
  ],
};

export const countryBounds = {
  default: "#19b5fe",
  blue: "#f27935",
  purple: "#f27935",
  orange: "#19b5fe",
};
