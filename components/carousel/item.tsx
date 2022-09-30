import { IEventImage } from 'interfaces/event'

interface IComponentProps {
  eventImage: IEventImage
}

export default function Item(props: IComponentProps){
  const {eventImage} = props
  return (
    <div style={{textAlign: "center"}}>
      <img src={eventImage.image_url} alt="event image" height="600px"></img>
    </div>
  )
}