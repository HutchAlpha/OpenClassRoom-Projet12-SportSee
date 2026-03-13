import { select, scaleBand, scaleLinear, max, axisBottom, line, curveMonotoneX, pointer } from "d3";
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

        //! FOND ROUGE
        svg.append("rect")
        .attr("width", "100%").attr("height", "100%")
        .attr("fill", "#FF0000");

        //! configuration du svg
        svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

        //! récupération des sessions
        const sessions = data.averageSessions?.sessions || [];

        //! jours affichés
        const days = ["L","M","M","J","V","S","D"];

        //! échelle X
        const x = scaleBand()
        .domain(days)
        .range([20, width - 20]); 

        //! échelle Y
        const y = scaleLinear()
        .domain([0, Math.max(60, max(sessions, d => d.sessionLength))])
        .range([height - 40, 100]);

        //! générateur de ligne
        const lineGenerator = line()
        .x((d,i) => x(days[i]) + x.bandwidth()/2)
        .y(d => y(d.sessionLength))
        .curve(curveMonotoneX);

        //! dessin de la courbe
        svg
        .append("path")
        .datum(sessions)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

        //! points sur la courbe
        svg
        .selectAll("circle")
        .data(sessions)
        .enter()
        .append("circle")
        .attr("cx", (d,i) => x(days[i]) + x.bandwidth()/2)
        .attr("cy", d => y(d.sessionLength))
        .attr("r", 4)
        .attr("fill", "white");

        //! axe X
        const xAxisG = svg
        .append("g")
        .attr("transform", `translate(0, ${height - 30})`)
        .call(axisBottom(x).tickSize(0));
        xAxisG.select(".domain").remove();
        xAxisG.selectAll("text")
        .attr("fill", "rgba(255,255,255,0.5)")
        .attr("dy", "1em");

        //! titre
        svg
        .append("text")
        .attr("x", 20)
        .attr("y", 45)
        .attr("font-size", "14px")
        .attr("fill", "rgba(255,255,255,0.7)")
        .text("Durée moyenne des");

        svg
        .append("text")
        .attr("x", 20)
        .attr("y", 65)
        .attr("font-size", "14px")
        .attr("fill", "rgba(255,255,255,0.7)")
        .text("sessions");

        //? TOOLTIP
        const tooltip = svg
        .append("g")
        .style("display", "none");

        tooltip
        .append("rect")
        .attr("width", 55)
        .attr("height", 28)
        .attr("fill", "#FFFFFF")
        .attr("rx", 3);

        const tooltipText = tooltip
        .append("text")
        .attr("x", 27)
        .attr("y", 17)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000");

        //? zone hover invisible
        svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")

        //? HOVER MOVE
        .on("mousemove", function(event) {
            const [xPos] = pointer(event);
            const bandwidth = x.bandwidth();
            const index = Math.floor((xPos - 20) / bandwidth);
            if (index >= 0 && index < sessions.length) {
                const value = sessions[index].sessionLength;
                const tipX = x(days[index]) + x.bandwidth()/2 - 27;
                const tipY = Math.max(20, y(value) - 40);
                tooltip
                .style("display", null)
                .attr("transform", `translate(${tipX}, ${tipY})`);
                tooltipText.text(`${value} min`);
            }
        })
        //? HOVER END
        .on("mouseout", function() {
            tooltip.style("display", "none");
        });

    }, [data]);

    return <svg ref={svgRefSession}></svg>;
}

export default Session;
