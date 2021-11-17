import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { IEventImage } from '../../interfaces/event'
import Item from './item'

const Carousel = dynamic(
  () => import('react-material-ui-carousel'),
  { ssr: false }
)

interface IComponentProps {
  eventImages: IEventImage[]
}

export default function CustomCarousel(props: IComponentProps){
  const {eventImages} = props
  useEffect(() => {
    console.log("eventImages: ", eventImages)
  }, [])

  return (
    <Carousel>
      {
        eventImages.map( (eventImage, i) => <Item key={i} eventImage={eventImage} /> )
      }
    </Carousel>
  )
}