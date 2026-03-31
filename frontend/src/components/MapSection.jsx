import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { API_BASE_URL } from "../config";

const MapSection = () => {
    useEffect(() => {
        const map = L.map("map", {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            touchZoom: false,
        }).setView([22.9734, 78.6569], 5);

        map.setMaxBounds([
            [6, 68],
            [38, 97],
        ]);


        let geoLayer;
        let projectData = {};

        // 🔥 Fetch your PHP API Dynamically (Compatible with Bluehost and Local)
        fetch(`${API_BASE_URL}/projects.php`)
            .then((res) => res.json())
            .then((res) => {
                const projects = res.data;

                projects.forEach((p) => {
                    const state = p.location;

                    if (!projectData[state]) {
                        projectData[state] = [];
                    }

                    projectData[state].push(p.title);
                });

                loadMap();
            });

        function loadMap() {
            fetch("/india_states.geojson")
                .then(res => res.json())
                .then(data => {

                    geoLayer = L.geoJSON(data, {
                        style: defaultStyle,
                        onEachFeature: onEachFeature
                    }).addTo(map);

                    map.fitBounds(geoLayer.getBounds());

                    setTimeout(() => {
                        map.invalidateSize();
                    }, 100);
                });
        }

        function defaultStyle(feature) {
            const stateName = feature.properties.NAME_1;
            const hasProjects = projectData[stateName]?.length > 0;

            // ... in MapSection.jsx

// Update the conditional coloring line within defaultStyle function:
return {
    color: "#ffffff",
    weight: 1.5,
    fillColor: hasProjects ? "#576123" : "#333333", // Green for active, dark gray/shade for empty
    fillOpacity: hasProjects ? 0.95 : 0.7,
};

// ...
        }

        function highlightStyle() {
            return {
                color: "#ffffff",
                weight: 2,
                fillColor: "#1A2718", // Darker Deep forest green on hover
                fillOpacity: 1,
            };
        }

        function highlightFeature(e) {
            const layer = e.target;

            geoLayer.eachLayer((l) => {
                l.setStyle({ fillOpacity: 0.3 });
            });

            layer.setStyle(highlightStyle());
            layer.setStyle({ fillOpacity: 1 });
            layer.bringToFront();
        }

        function resetHighlight() {
            geoLayer.eachLayer((l) => {
                geoLayer.resetStyle(l);
            });
        }

        function onEachFeature(feature, layer) {
            const stateName = feature.properties.NAME_1;
            const projects = projectData[stateName] || [];

            let projectHTML = "";

            if (projects.length > 0) {
                projectHTML = "<ul>";
                projects.forEach((p) => {
                    projectHTML += `<li>${p}</li>`;
                });
                projectHTML += "</ul>";
            } else {
                projectHTML = "<i>No active projects</i>";
            }

            const content = `
        <div style="font-weight:bold; margin-bottom:5px;">
          ${stateName}
        </div>
        ${projectHTML}
      `;

            layer.bindTooltip(content, {
                direction: "center",
                className: "custom-tooltip",
            });

            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
            });
        }

        return () => {
            map.remove();
        };
    }, []);

return (
        <>
            <style>{`.leaflet-container { background: transparent !important; }`}</style>
            <div
                id="map"
                style={{
                    height: "100%",  // 🔥 MUST be 100%, not 800px
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                    // 🔥 Removed marginLeft to keep it perfectly centered
                }}
            ></div>
        </>
    );
};

export default MapSection;