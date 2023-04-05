import { Link } from "@remix-run/react";

export default function EventItemsList() {
  return (
    <div>
      <h1>Event Items</h1>
      <ul>
        <li><Link to={"id12345"}>Event Item (Attendee)</Link></li>
        <li><Link to={"id12345"}>Event Item (Attendee)</Link></li>
        <li><Link to={"id12345"}>Event Item (Attendee)</Link></li>
      </ul>
    </div>
  )
}