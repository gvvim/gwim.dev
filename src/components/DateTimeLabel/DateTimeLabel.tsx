import { useEffect, useState } from 'react'
import './DateTimeLabel.css'

export default function DateTimeLabel() {
  
  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const [dateAndTime, setDateAndTime] = useState(new Date().toLocaleString(undefined, dateFormat))

  const updateTime = () => {
    setDateAndTime((new Date()).toLocaleString(undefined, dateFormat));
  }
  
  useEffect(() => {
    setInterval(updateTime, 5000)
  }, []);
  
  return (
    <p className="time">
    {dateAndTime}
    </p>
  )
}