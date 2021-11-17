import locationsJson from "./location.json"
import MenuItem from '@mui/material/MenuItem';

const locations: Array<any> = []

for (const [key, value] of Object.entries(locationsJson)) {
  locations.push(<MenuItem key={key} value={parseInt(key)}>{value.name}</MenuItem>)
}

export default locations;