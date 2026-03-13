import { select, scaleBand, scaleLinear, max, axisBottom, axisRight, pointer } from "d3";
import { useRef, useEffect } from "react";

function Activite({ data }) {

  const svgRefActivite = useRef();

  useEffect(() => {

    const width = 825;
    const height = 320;

    //! sélection du svg
    const svg = select(svgRefActivite.current);

    //! nettoyage du svg
    svg.selectAll("*").remove();

    //! configuration du svg
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    //! récupération des données
    const sessions = data.activity.sessions || [];

    //! échelle X
    const x = scaleBand()
      .domain(sessions.map(d => d.day))
      .range([50, width - 40])
      .padding(0.4);

    //! échelle Y calories
    const yCalories = scaleLinear()
      .domain([0, max(sessions, d => d.calories)])
      .range([height - 40, 40]);

    //! échelle Y poids
    const yPoids = scaleLinear()
      .domain([minPoids(sessions) - 1, max(sessions, d => d.kilogram) + 1])
      .range([height - 40, 40]);

    //? TOOLTIP (toujours au dessus)
    const tooltip = svg
      .append("g")
      .style("display", "none");

    tooltip
      .append("rect")
      .attr("width", 60)
      .attr("height", 50)
      .attr("fill", "#E60000");

    const tooltipKg = tooltip
      .append("text")
      .attr("x", 30)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");

    const tooltipCal = tooltip
      .append("text")
      .attr("x", 30)
      .attr("y", 38)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");

    //! titre
    svg
      .append("text")
      .attr("x", 50)
      .attr("y", 25)
      .attr("font-size", "15px")
      .attr("font-weight", "600")
      .attr("fill", "#20253A")
      .text("Activité quotidienne");

    //! légende poids
    svg
      .append("circle")
      .attr("cx", width - 220)
      .attr("cy", 25)
      .attr("r", 4)
      .attr("fill", "#282D30");

    svg
      .append("text")
      .attr("x", width - 205)
      .attr("y", 29)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("Poids (kg)");

    //! légende calories
    svg
      .append("circle")
      .attr("cx", width - 120)
      .attr("cy", 25)
      .attr("r", 4)
      .attr("fill", "#E60000");

    svg
      .append("text")
      .attr("x", width - 105)
      .attr("y", 29)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("Calories brûlées (kCal)");

    //! axe X
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - 40})`)
      .call(axisBottom(x));

    //! axe Y droite
    svg
      .append("g")
      .attr("transform", `translate(${width - 40}, 0)`)
      .call(axisRight(yPoids).ticks(max(sessions, d => d.kilogram) - minPoids(sessions)));

    //! barres poids
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
      .attr("rx", 3)

      //? HOVER START
      .on("mouseover", function(event, d) {

        tooltip.style("display", null);

        tooltipKg.text(`${d.kilogram}kg`);
        tooltipCal.text(`${d.calories}kCal`);

        tooltip.raise(); // Infos au dessus du graphique

      })

      //? HOVER MOVE
      .on("mousemove", function(event) {

        const [xPos] = pointer(event);

        tooltip.attr("transform", `translate(${xPos - 30}, 60)`);

      })

      //? HOVER END
      .on("mouseout", function() {

        tooltip.style("display", "none");

      });

    //! barres calories
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

  //! fonction min poids
  function minPoids(sessions) {
    return Math.min(...sessions.map(d => d.kilogram));
  }

  return <svg ref={svgRefActivite}></svg>;
}

export default Activite;