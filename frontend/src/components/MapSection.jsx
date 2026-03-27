import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { API_BASE_URL } from "../config"; // ✅ IMPORTANT

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

    // ✅ LIVE API CALL
    fetch(`${API_BASE_URL}/projects.php?t=${Date.now()}`)
      .then((res) => res.json())
      .then((res) => {
        const projects = res.data || [];

        projects.forEach((p) => {
          const state = p.location;

          if (!projectData[state]) {
            projectData[state] = [];
          }

          projectData[state].push(p.title);
        });

        loadMap();
      })
      .catch((err) => {
        console.error("API Error:", err);
        loadMap(); // still load map even if API fails
      });

    function loadMap() {
      fetch("/india_states.geojson")
        .then((res) => res.json())
        .then((data) => {
          geoLayer = L.geoJSON(data, {
            style: defaultStyle,
            onEachFeature: onEachFeature,
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
        color: "#d1d5db",
        weight: 1,
        fillColor: hasProjects ? "#93c5fd" : "#f3f4f6",
        fillOpacity: 1,
      };
    }

    function highlightStyle() {
      return {
        color: "#1e40af",
        weight: 2.5,
        fillColor: "#2563eb",
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
          ${stateName} (${projects.length})
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
    <div
      id="map"
      style={{
        height: "800px",
        width: "100%",
        borderRadius: "12px",
        position: "relative",
        zIndex: 1,
      }}
    ></div>
  );
};

export default MapSection;