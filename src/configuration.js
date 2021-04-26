export const accessToken =
  process.env.NODE_ENV === "development"
    ? "pk.eyJ1IjoibWFyY29sYXJvc2EiLCJhIjoiY2trb3I1NHR4MDdvdTJ4cGh3YzU3eWZnZyJ9.h0IqZUqMx2sLoSQc5KM1Lg"
    : "pk.eyJ1IjoibmljaG9sYXN0IiwiYSI6ImNrbmR1OXZodTE2cmUyem1panB1bWduejUifQ.YJRyVbKg1AQ8Cf5vaYAiag";

export const mapBoxStyle = "mapbox://styles/mapbox/light-v10";

export const resourceSteps = {
  default: [
    { count: 3, color: "#6c7a89" },
    { count: 10, color: "#f03434" },
    { count: 100, color: "#eeee00" },
    { count: 500, color: "#e87e04" },
    { count: 500, color: "#26a656" },
  ],
  blue: [
    { count: 3, color: "#6c7a89" },
    { count: 10, color: "#c5eff7" },
    { count: 100, color: "#bdd7e7" },
    { count: 500, color: "#6baed6" },
    { count: 500, color: "#2171b5" },
  ],
  purple: [
    { count: 3, color: "#6c7a89" },
    { count: 10, color: "#f2f0f7" },
    { count: 100, color: "#cbc9e2" },
    { count: 500, color: "#9e9ac8" },
    { count: 500, color: "#6a51a3" },
  ],
  orange: [
    { count: 3, color: "#6c7a89" },
    { count: 10, color: "#feedde" },
    { count: 100, color: "#fdbe85" },
    { count: 500, color: "#fd8d3c" },
    { count: 500, color: "#d94701" },
  ],
};
