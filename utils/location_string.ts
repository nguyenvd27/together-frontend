import locationsJson from "./location.json"

export default function locationString(location: number) {
  for (const [key, value] of Object.entries(locationsJson)) {
    if(parseInt(key) == location) {
      return value.name
    }
  }
  return "Unknown"
}
