export const accessToken =
  process.env.NODE_ENV === "development"
    ? "pk.eyJ1IjoibWFyY29sYXJvc2EiLCJhIjoiY2trb3I1NHR4MDdvdTJ4cGh3YzU3eWZnZyJ9.h0IqZUqMx2sLoSQc5KM1Lg"
    : "pk.eyJ1IjoibWFyY29sYXJvc2EiLCJhIjoiY2trb3I1NHR4MDdvdTJ4cGh3YzU3eWZnZyJ9.h0IqZUqMx2sLoSQc5KM1Lg";

export const mapBoxStyle = "mapbox://styles/mapbox/light-v10";

export const resourceSteps = {
  normal: [
    { count: 10, color: "#f03434" },
    { count: 100, color: "#eeee00" },
    { count: 500, color: "#e87e04" },
    { count: 500, color: "#26a656" },
  ],
  blue: [
    { count: 10, color: "#c5eff7" },
    { count: 100, color: "#bdd7e7" },
    { count: 500, color: "#6baed6" },
    { count: 500, color: "#2171b5" },
  ],
};
