const SERVER_URL = 'https://location-tracker-dhfw.onrender.com';
 // Replace with your deployed backend URL if hosted remotely

// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default world view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Handle form submission
document.getElementById('location-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const load = document.getElementById('load').value;
  const message = document.getElementById('message').value;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`${SERVER_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, load, message, latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const result = await response.json();
          alert(`Success! Address: ${result.address}`);

          // Update map with the submitted location
          map.setView([latitude, longitude], 13);
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`<strong>${name}</strong><br>${result.address}`)
            .openPopup();
        } catch (error) {
          console.error('Error submitting data:', error.message);
          alert('Failed to submit data. Please try again.');
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        alert('Failed to get location. Please allow location access.');
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});
