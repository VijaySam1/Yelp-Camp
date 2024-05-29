mapboxgl.accessToken = maptoken;
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/satellite-v9', // style URL
        center:camp.geometry.coordinates, // starting position [lng, lat]
        zoom: 14, // starting zoom
        projection: 'globe' // display the map as a 3D globe
        });
        map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
        });

        map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

        const nav = new mapboxgl.NavigationControl({
            visualizePitch: true
        });
        map.addControl(nav, 'bottom-right');

        new mapboxgl.Marker()
        .setLngLat(camp.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h4>${camp.title}</h4><p>${camp.location}</p>`
            )
        )
        .addTo(map)