import { Paper } from '@mui/material'
import { IEventImage } from '../../interfaces/event'

interface IComponentProps {
  eventImage: IEventImage
}

export default function Item(props: IComponentProps){
  const {eventImage} = props
  return (
    <Paper>
      <img src={eventImage.image_url} alt="Girl in a jacket" width="100%" height="500px"></img>
    </Paper>
  )
}