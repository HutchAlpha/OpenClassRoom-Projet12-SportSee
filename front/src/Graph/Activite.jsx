import { select, scaleBand, scaleLinear, max } from "d3";
import { useRef, useEffect } from "react";

function Activite({ data }) {

  const svgRef = useRef();

  useEffect(() => {

    const width = 825;
    const height = 320;

    const svg = select(svgRef.current);

    // nettoie le svg si rerender
    svg.selectAll("*").remove(); 

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const sessions = data.activity.sessions;

    // échelle X (jours)
    const x = scaleBand()
      .domain(sessions.map(d => d.day))
      .range([50, width - 40])
      .padding(0.4);

    // échelle Y calories
    const yCalories = scaleLinear()
      .domain([0, max(sessions, d => d.calories)])
      .range([height - 40, 40]);

    // échelle Y poids
    const yPoids = scaleLinear()
      .domain([minPoids(sessions) - 1, max(sessions, d => d.kilogram) + 1])
      .range([height - 40, 40]);

    // barres poids (noir)
    svg
      .selectAll(".poids")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "poids")
      .attr("x", d => x(d.day))
      .attr("y", d => yPoids(d.kilogram))
      .attr("width", 7)
      .attr("height", d => height - 40 - yPoids(d.kilogram))
      .attr("fill", "#282D30")
      .attr("rx", 3);

    // barres calories (rouge)
    svg
      .selectAll(".calories")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "calories")
      .attr("x", d => x(d.day) + 12)
      .attr("y", d => yCalories(d.calories))
      .attr("width", 7)
      .attr("height", d => height - 40 - yCalories(d.calories))
      .attr("fill", "#E60000")
      .attr("rx", 3);

  }, [data]);

  function minPoids(sessions) {
    return Math.min(...sessions.map(d => d.kilogram));
  }

  return <svg ref={svgRef}></svg>;
}

export default Activite;