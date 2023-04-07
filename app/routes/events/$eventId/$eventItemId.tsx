import { Link } from "@remix-run/react";

export default function EventItem() {
  return (
    <div>
      <h1>Event Item Details</h1>
      <h4>Event Item</h4>
      <p>Event Item Details</p>
      <Link to={"/events"}>View All Items</Link>
    </div>
  )
}