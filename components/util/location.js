// API key ini dipanggil dibawah
const GOOGLE_API_KEY = "AIzaSyDotvrVvgT4TBmDC4GgLY9xeT0smF48NBE";

// url dibawah ini akan dipanggil di file LocationPicker.js
export function getMapPreview(lat, lng) {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url); //metode fetch url

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data = await response.json();
  const address = data.results[0].formatted_address; //lokasi cek di documentation geocode
  return address;
}
