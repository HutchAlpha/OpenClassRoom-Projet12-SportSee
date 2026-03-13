import { select, scaleLinear, arc } from "d3";
import { useRef, useEffect } from "react";


function Objectif({ data }) {
    const svgRefObjectif = useRef();


    useEffect(() => {
        const width = 258;
        const height = 263;


        //! sélection du svg
        const svg = select(svgRefObjectif.current);


        //! nettoyage
        svg.selectAll("*").remove();


        //! FOND
        svg.append("rect")
        .attr("width", "100%").attr("height", "100%")
        .attr("fill", "#FBFBFB");


        //! configuration du svg
        svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);


        //! récupération des sessions
        const sessions = data.main.todayScore || [];

        //! dimensions du cercle
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 80;
        const innerRadius = 70;

        const angle = scaleLinear()
        .domain([0, 1])
        .range([0, -2 * Math.PI]); // Vers la gauche


        //! générateur d'arc background complet
        const arcBg = arc()
        .innerRadius(0)
        .outerRadius(innerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

        //! arc de progression
        const arcProgress = arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .startAngle(0)
        .endAngle(angle(sessions))
        .cornerRadius(10); 

        //! fond du cercle (blanc)
        svg.append("path")
        .attr("d", arcBg)
        .attr("fill", "white")
        .attr("transform", `translate(${centerX}, ${centerY})`);

        //! arc de progression (rouge)
        svg.append("path")
        .attr("d", arcProgress)
        .attr("fill", "#FF0000")
        .attr("transform", `translate(${centerX}, ${centerY})`);

        //! bordure grise fine
        svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "transparent") 
        .attr("stroke-width", 0);

        //! textes centraux
        svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "26px")
        .attr("font-weight", "bold")
        .attr("fill", "#282D30")
        .text(`${Math.round(sessions * 100)}%`);

        svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#74798C")
        .text("de votre");

        svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#74798C")
        .text("objectif");

        //! titre
        svg.append("text")
        .attr("x", 30)
        .attr("y", 40)
        .attr("text-anchor", "start")
        .attr("font-size", "15px")
        .attr("font-weight", "500")
        .attr("fill", "#20253A")
        .text("Score");
    }, [data]);


    return <svg ref={svgRefObjectif}></svg>;
}


export default Objectif;