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

    //! fond du graphique
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#FBFBFB")
      .attr("rx", 5);

    //! récupération des données
    const sessions = data.activity.sessions || [];
    const dayLabels = sessions.map((_, i) => i + 1);

    //! échelle X
    const x = scaleBand()
      .domain(dayLabels)
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

    //! titre
    svg
      .append("text")
      .attr("x", 50)
      .attr("y", 25)
      .attr("font-size", "15px")
      .attr("font-weight", "600")
      .attr("fill", "#20253A")
      .text("Activité quotidienne");

    //! légendes (regroupées pour éviter les doublons)
    const legends = [
      { text: "Poids (kg)", color: "#282D30", cx: width - 310, tx: width - 295 },
      { text: "Calories brûlées (kCal)", color: "#E60000", cx: width - 200, tx: width - 185 }
    ];

    legends.forEach(leg => {
      svg.append("circle").attr("cx", leg.cx).attr("cy", 25).attr("r", 4).attr("fill", leg.color);
      svg.append("text").attr("x", leg.tx).attr("y", 29).attr("font-size", "14px").attr("fill", "#74798C").text(leg.text);
    });

    //! axe X
    const xAxisG = svg.append("g")
      .attr("transform", `translate(0, ${height - 40})`)
      .call(axisBottom(x).tickSize(0));
    
    xAxisG.select(".domain").remove();

    xAxisG.selectAll("text")
      .attr("fill", "#9B9EAC")
      .attr("dy", "1.5em")
      .attr("dx", 9.5 - (x.bandwidth() / 2)) 
      .style("font-size", "14px")
      .style("font-weight", "500");

    //! axe Y droite
    const yAxisG = svg.append("g")
      .attr("transform", `translate(${width - 40}, 0)`)
      .call(axisRight(yPoids).ticks(3));
      
    yAxisG.select(".domain").remove();
    yAxisG.selectAll(".tick line").remove();

    yAxisG.selectAll("text")
      .attr("fill", "#9B9EAC")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .attr("dx", 15);

    //! grille horizontales en Pointillé
    yPoids.ticks(3).forEach(v => {
      svg.append("line")
        .attr("x1", 50)
        .attr("x2", width - 40)
        .attr("y1", yPoids(v))
        .attr("y2", yPoids(v))
        .attr("stroke", "#DEDEDE")
        .attr("stroke-dasharray", "3,3");
    });

    //! Barres (poids et calories)
    const drawBars = (className, valueScale, dataKey, color, offsetX) => {
      svg.selectAll(`.${className}`)
        .data(sessions)
        .enter()
        .append("rect")
        .attr("class", className)
        .attr("x", (d, i) => x(i + 1) + offsetX)
        .attr("y", d => valueScale(d[dataKey]))
        .attr("width", 7)
        .attr("height", d => height - 40 - valueScale(d[dataKey]))
        .attr("fill", color)
        .attr("rx", 3);
    };

     //! Génération des barres 
    drawBars("poids", yPoids, "kilogram", "#282D30", 0);
    drawBars("calories", yCalories, "calories", "#E60000", 12);

    //? TOOLTIP stylisée
    const tooltip = svg.append("g").style("display", "none");

    tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 70)
      .attr("fill", "#E60000"); 

    const createTooltipText = (yPos) => tooltip.append("text")
      .attr("x", 30)
      .attr("y", yPos)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-weight", "500");

    const tooltipKg = createTooltipText(25);
    const tooltipCal = createTooltipText(55);

    //? Survol (hover)
    svg
      .selectAll(".hover-zone")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "hover-zone")
      .attr("x", (d, i) => x(i + 1) - 18)
      .attr("y", 40)
      .attr("width", 56)
      .attr("height", height - 80)
      .attr("fill", "#C4C4C4")
      .attr("opacity", 0) // Caché par défaut, mais intercepte la souris
      .on("mouseover", function(event, d) {
        // Affiche directement au fond gris
        select(this).attr("opacity", 0.3);

        // Maj la tooltip
        tooltip.style("display", "block");
        tooltipKg.text(`${d.kilogram}kg`);
        tooltipCal.text(`${d.calories}Kcal`);
        tooltip.raise();
      })
      .on("mousemove", function(event, d) {
        const i = sessions.indexOf(d);
        const [_, yPos] = pointer(event);
        
        // Suit la souris en hauteur et se place à droite
        tooltip.attr("transform", `translate(${x(i + 1) + 48}, ${yPos - 35})`);
      })
      .on("mouseout", function(event, d) {
        // Cache le fond gris et la tooltip
        select(this).attr("opacity", 0);
        tooltip.style("display", "none");
      });

  }, [data]);

  //! fonction min poids
  function minPoids(sessions) {
    return Math.min(...sessions.map(d => d.kilogram));
  }

  return <svg ref={svgRefActivite}></svg>;
}

export default Activite;
