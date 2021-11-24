import dynamic from 'next/dynamic'

import { IEventImage } from 'interfaces/event'
import Item from 'components/carousel/item'

const Carousel = dynamic(
  () => import('react-material-ui-carousel'),
  { ssr: false }
)

interface IComponentProps {
  eventImages: IEventImage[]
}

export default function CustomCarousel(props: IComponentProps){
  const {eventImages} = props

  return (
    <Carousel>
      {
        eventImages.map( (eventImage, i) => <Item key={i} eventImage={eventImage} /> )
      }
    </Carousel>
  )
}