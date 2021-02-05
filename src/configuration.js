export const accessToken =
  process.env.NODE_ENV === "development"
    ? "pk.eyJ1IjoibWFyY29sYXJvc2EiLCJhIjoiY2trb3I1NHR4MDdvdTJ4cGh3YzU3eWZnZyJ9.h0IqZUqMx2sLoSQc5KM1Lg"
    : "";

export const mapBoxStyle = "mapbox://styles/mapbox/light-v10";

export const resourceSteps = [
  { count: 10, color: "#f03434" },
  { count: 100, color: "#f5ab35" },
  { count: 100, color: "#26a656" },
];
