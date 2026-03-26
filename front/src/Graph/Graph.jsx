import { select, scaleLinear} from "d3";
import { useRef, useEffect } from "react";

function Graph({ data }) {
    const svgRefGraph = useRef();

    useEffect(() => {

        const width = 258;
        const height = 263;

        //! sélection du svg
        const svg = select(svgRefGraph.current);

        //! nettoyage du svg
        svg.selectAll("*").remove();

        //! FOND
        svg.append("rect")
            .attr("width", "100%").attr("height", "100%")
            .attr("fill", "#282D30")
            .attr("rx", 5);

        //! configuration du svg
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`);

        //! récupération des sessions
        const categories = data.performance.kind || {};

        const performanceData = data.performance.data.map(d => ({
            value: d.value,
            kind: categories[d.kind]
        })).reverse(); // Inversion

        //! dimensions du cercle
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 70; // Rayon max pour le graphique

        const angleScale = scaleLinear()
            .domain([0, performanceData.length])
            .range([0, 2 * Math.PI]);

        const radialScale = scaleLinear()
            .domain([0, 250]) 
            .range([0, radius]);

        //! hexagones de fond
        const levels = [0.2, 0.4, 0.6, 0.8, 1];
        levels.forEach(level => {
            const points = performanceData.map((_, i) => {
                const angle = angleScale(i) - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius * level;
                const y = centerY + Math.sin(angle) * radius * level;
                return [x, y];
            });

            svg.append("polygon")
                .attr("points", points.map(p => p.join(",")).join(" "))
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 1);
        });

        //!Génération de la forme radar rouge
        const radarPoints = performanceData.map((d, i) => {
            const angle = angleScale(i) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radialScale(d.value);
            const y = centerY + Math.sin(angle) * radialScale(d.value);
            return [x, y];
        });

        svg.append("polygon")
            .attr("points", radarPoints.map(p => p.join(",")).join(" "))
            .attr("fill", "#FF0101")
            .attr("fill-opacity", 0.7);

        //! textes centraux
        // (Placés aux extrémités des axes)
        performanceData.forEach((d, i) => {
            const angle = angleScale(i) - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;

            svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("font-size", "12px")
                .attr("fill", "white")
                .text(d.kind);
        });

    }, [data]);

    return <svg ref={svgRefGraph}></svg>;
}

export default Graph;