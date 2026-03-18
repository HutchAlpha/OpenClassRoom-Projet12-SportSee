import { select, scalePoint, scaleLinear, max, axisBottom, line, curveMonotoneX, pointer } from "d3";
import { useRef, useEffect } from "react";

function Session({ data }) {
  const svgRefSession = useRef();

  useEffect(() => {
    const width = 258;
    const height = 263;

    //! sélection du svg
    const svg = select(svgRefSession.current);

    //! nettoyage
    svg.selectAll("*").remove();

    //! DÉFINITION DU DÉGRADÉ POUR LA LIGNE 
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Début transparent (gauche)
    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(255, 255, 255, 0.2)");

    // Fin opaque (droite)
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(255, 255, 255, 0.8)");

    //! FOND ROUGE
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#FF0000")
      .attr("rx", 5);

    //! configuration du svg
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    //! récupération des sessions
    const sessions = data.averageSessions?.sessions || [];

    //! jours affichés
    const days = ["L", "M", "M", "J", "V", "S", "D"];

    //! échelle X : scalePoint va jusqu'aux bords
    const x = scalePoint()
      .domain(sessions.map((_, i) => i))
      .range([0, width]) // Va du bord gauche au bord droit (width)
      .padding(0.1); // Padding axe X (L,M...)

    //! échelle Y
    const y = scaleLinear()
      .domain([0, Math.max(60, max(sessions, d => d.sessionLength))])
      .range([height - 40, 100]);

    //! générateur de ligne
    const lineGenerator = line()
      .x((d, i) => x(i))
      .y(d => y(d.sessionLength))
      .curve(curveMonotoneX);

    //! dessin de la courbe avec le dégradé
    svg
      .append("path")
      .datum(sessions)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)") // Application du dégradé
      .attr("stroke-width", 2.5)
      .attr("d", lineGenerator);

    //! Voile sombre (Overlay) caché par défaut
    const darkOverlay = svg
      .append("rect")
      .attr("y", 0)
      .attr("height", height)
      .attr("fill", "rgba(0, 0, 0, 0.1)")
      .style("opacity", 0);

    //! axe X
    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(0, ${height - 30})`)
      .call(
        axisBottom(x)
          .tickSize(0)
          .tickFormat((d) => days[d])
      );

    xAxisG.select(".domain").remove();
    xAxisG.selectAll("text")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("dy", "1em")
      .style("font-size", "13px")
      .style("font-weight", "500");

    //! titre
    svg.append("text")
      .attr("x", 20)
      .attr("y", 45)
      .attr("font-size", "15px")
      .attr("fill", "rgba(255,255,255,0.5)")
      .text("Durée moyenne des");

    svg.append("text")
      .attr("x", 20)
      .attr("y", 65)
      .attr("font-size", "15px")
      .attr("fill", "rgba(255,255,255,0.5)")
      .text("sessions");

    //? Halo du point au survol
    const hoverCircleHalo = svg
      .append("circle")
      .attr("r", 10)
      .attr("fill", "rgba(255, 255, 255, 0.3)")
      .style("opacity", 0);

    //? Point blanc au survol
    const hoverCircle = svg
      .append("circle")
      .attr("r", 4)
      .attr("fill", "#FFFFFF")
      .style("opacity", 0);

    //? TOOLTIP
    const tooltip = svg
      .append("g")
      .style("display", "none");

    tooltip
      .append("rect")
      .attr("width", 45)
      .attr("height", 25)
      .attr("fill", "#FFFFFF")
      .attr("rx", 0);

    const tooltipText = tooltip
      .append("text")
      .attr("x", 22.5)
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#000");

    //? zone hover invisible
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", function(event) {
        const [xPos] = pointer(event);
        
        // Calcul pour trouver le point le plus proche (scalePoint)
        const domain = x.domain();
        const range = x.range();
        const step = x.step();
        
        // On détermine l'index le plus proche de la souris
        let index = Math.round((xPos - range[0]) / step);
        if (index < 0) index = 0;
        if (index >= sessions.length) index = sessions.length - 1;
        
        if (index >= 0 && index < sessions.length) {
          const value = sessions[index].sessionLength;
          const currentX = x(index);
          const currentY = y(value);

          // L'ombre de fond 
          darkOverlay
            .attr("x", currentX)
            .attr("width", width - currentX)
            .style("opacity", 1);

          // Mise à jour des points de survol
          hoverCircleHalo
            .attr("cx", currentX)
            .attr("cy", currentY)
            .style("opacity", 1);
            
          hoverCircle
            .attr("cx", currentX)
            .attr("cy", currentY)
            .style("opacity", 1);

          const tipX = currentX + 10;
          const tipY = currentY - 30;

          tooltip
            .style("display", null)
            .attr("transform", `translate(${tipX}, ${tipY})`);
          
          tooltipText.text(`${value} min`);
        }
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
        darkOverlay.style("opacity", 0);
        hoverCircle.style("opacity", 0);
        hoverCircleHalo.style("opacity", 0);
      });

  }, [data]);

  return <svg ref={svgRefSession}></svg>;
}

export default Session;
