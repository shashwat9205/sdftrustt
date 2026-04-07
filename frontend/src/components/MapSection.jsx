import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { API_BASE_URL } from "../config";

// 🔥 Added onStateSelect prop
const MapSection = ({ onStateSelect }) => {
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

        // 🔥 Reset sidebar to Impact Snapshot if you click the dark background of the map
        map.on('click', () => {
            if (onStateSelect) onStateSelect(null);
        });

        let geoLayer;
        let projectData = {};

       // 🔥 Added Cache-Buster and .trim() for safety!
        fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`)
            .then((res) => res.json())
            .then((res) => {
                const projects = res.data;


                projects.forEach((p) => {
                    // .trim() removes accidental spaces like "Delhi " -> "Delhi"
                    const state = p.location ? p.location.trim() : "";

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

            return {
                color: "#ffffff",
                weight: 1.5,
                fillColor: hasProjects ? "#576123" : "#333333", 
                fillOpacity: hasProjects ? 0.95 : 0.7,
                className: "state-feature transition-all duration-300 origin-center" 
            };
        }

        function highlightStyle() {
            return {
                color: "#ffffff",
                weight: 2,
                fillColor: "#1A2718", 
                fillOpacity: 1,
            };
        }

        function highlightFeature(e) {
            const layer = e.target;
            
            // Dim others slightly
            geoLayer.eachLayer((l) => {
                l.setStyle({ fillOpacity: 0.3 });
            });
            
            layer.setStyle(highlightStyle());
            layer.bringToFront();
            
            // 🔥 Manually add the scale class to the SVG element representing the layer
            if (layer._path) {
                layer._path.classList.add("state-hovered");
            }
        }

        function resetHighlight(e) {
            const layer = e.target;
            
            geoLayer.eachLayer((l) => {
                geoLayer.resetStyle(l);
            });
            
            // 🔥 Remove the scale class
            if (layer._path) {
                layer._path.classList.remove("state-hovered");
            }
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

            // 🔥 Added click handler for the state
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: (e) => {
                    L.DomEvent.stopPropagation(e); // Prevents map background click from firing
                    if (onStateSelect) {
                        onStateSelect({
                            name: stateName,
                            projects: projects
                        });
                    }
                }
            });
        }

        return () => {
            map.remove();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* 🔥 Added CSS for the pop-up effect */}
            <style>{`
                .leaflet-container { background: transparent !important; }
                
                /* State hover animation */
                path.state-feature {
                    transition: transform 0.2s ease, fill 0.2s ease, fill-opacity 0.2s ease;
                    transform-origin: center;
                }
                
                path.state-hovered {
                    transform: scale(1.02); /* Adjust this value for more/less pop (1.05 is quite a bit) */
                    filter: drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.4)); /* Adds a shadow underneath to enhance the 3D look */
                }
            `}</style>
            <div
                id="map"
                style={{
                    height: "100%", 
                    width: "100%",
                    position: "relative",
                    zIndex: 1,
                }}
            ></div>
        </>
    );
};

export default MapSection;