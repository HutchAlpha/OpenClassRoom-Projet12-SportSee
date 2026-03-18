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

    //! légende poids
    svg
      .append("circle")
      .attr("cx", width - 310)
      .attr("cy", 25)
      .attr("r", 4)
      .attr("fill", "#282D30");

    svg
      .append("text")
      .attr("x", width - 295)
      .attr("y", 29)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("Poids (kg)");

    //! légende calories
    svg
      .append("circle")
      .attr("cx", width - 200)
      .attr("cy", 25)
      .attr("r", 4)
      .attr("fill", "#E60000");

    svg
      .append("text")
      .attr("x", width - 185)
      .attr("y", 29)
      .attr("font-size", "14px")
      .attr("fill", "#74798C")
      .text("Calories brûlées (kCal)");

    //! axe X
    const xAxisG = svg.append("g")
      .attr("transform", `translate(0, ${height - 40})`)
      .call(axisBottom(x).tickSize(0));
    
    xAxisG.select(".domain").remove();

    const textOffset = 9.5 - (x.bandwidth() / 2);

    xAxisG.selectAll("text")
      .attr("fill", "#9B9EAC")
      .attr("dy", "1.5em")
      .attr("dx", textOffset) 
      .style("font-size", "14px")
      .style("font-weight", "500");

    //! axe Y droite
    const yAxisG = svg.append("g")
      .attr("transform", `translate(${width - 40}, 0)`)
      .call(axisRight(yPoids).ticks(3));
    yAxisG.select(".domain").remove();
    yAxisG.selectAll(".tick line").remove();

    //! lignes de grille horizontales
    yPoids.ticks(3).forEach(v => {
      svg.append("line")
        .attr("x1", 50)
        .attr("x2", width - 40)
        .attr("y1", yPoids(v))
        .attr("y2", yPoids(v))
        .attr("stroke", "#DEDEDE")
        .attr("stroke-dasharray", "3,3");
    });

    //? Fonds gris pour le hover (cachés par défaut, dessinés sous les barres)
    const hoverBackgrounds = svg
      .selectAll(".hover-bg")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "hover-bg")
      .attr("x", (d, i) => x(i + 1) - 18) // Centré autour des deux barres 
      .attr("y", 40) 
      .attr("width", 56) 
      .attr("height", height - 80) // S'arrête à l'axe X
      .attr("fill", "#C4C4C4")
      .attr("opacity", 0);

    //! barres poids
    svg
      .selectAll(".poids")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "poids")
      .attr("x", (d, i) => x(i + 1))
      .attr("y", d => yPoids(d.kilogram))
      .attr("width", 7)
      .attr("height", d => height - 40 - yPoids(d.kilogram))
      .attr("fill", "#282D30")
      .attr("rx", 3);

    //! barres calories
    svg
      .selectAll(".calories")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("class", "calories")
      .attr("x", (d, i) => x(i + 1) + 12)
      .attr("y", d => yCalories(d.calories))
      .attr("width", 7)
      .attr("height", d => height - 40 - yCalories(d.calories))
      .attr("fill", "#E60000")
      .attr("rx", 3);

    //? TOOLTIP stylisé selon la maquette (dessiné au-dessus de tout)
    const tooltip = svg
      .append("g")
      .style("display", "none");

    tooltip
      .append("rect")
      .attr("width", 60)
      .attr("height", 70)
      .attr("fill", "#E60000"); 

    const tooltipKg = tooltip
      .append("text")
      .attr("x", 30)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-weight", "500");

    const tooltipCal = tooltip
      .append("text")
      .attr("x", 30)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-weight", "500");

    //? Zones de capture de la souris
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
      .attr("fill", "transparent") // Totalement invisible
      .on("mouseover", function(event, d) {
        const i = sessions.indexOf(d);
        
        // Afficher le fond gris correspondant
        hoverBackgrounds.filter((_, index) => index === i).attr("opacity", 0.5);

        // Mettre à jour et afficher la tooltip
        tooltip.style("display", "block");
        tooltipKg.text(`${d.kilogram}kg`);
        tooltipCal.text(`${d.calories}Kcal`);
        tooltip.raise();
      })
      .on("mousemove", function(event, d) {
        const i = sessions.indexOf(d);
        const [_, yPos] = pointer(event);
        
        // Positionner la tooltip sur la droite du rectangle gris (avec un léger décalage)
        const xPosToolTip = x(i + 1) + 48; 
        
        // La hauteur de la tooltip suit légèrement la souris
        tooltip.attr("transform", `translate(${xPosToolTip}, ${yPos - 35})`);
      })
      .on("mouseout", function(event, d) {
        const i = sessions.indexOf(d);
        
        // Cacher le fond gris
        hoverBackgrounds.filter((_, index) => index === i).attr("opacity", 0);
        
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
