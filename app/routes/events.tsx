import { Link, Outlet } from "@remix-run/react";

export default function EventsRoute() {
  return (
    <div>
      <header style={{ display: "inline-flex", flexWrap: "wrap" }}>
        <div className="links">
          <Link to="/">Home</Link>
        </div>
        <h1 style={{ marginLeft: "200px" }}>Get Together</h1>
        <div className="user-info" style={{ marginLeft: "200px" }}>
          {/* <span>{`Hi ${data.user.username}`}</span> */}
          {/* vvvvv---Remove below after hooking up authentication---vvvvv */}
          <span>{`Hi User`}</span>
          <form action="/logout" method="post">
            <button type="submit" className="button">
              Logout
            </button>
          </form>
        </div>
      </header>
      <hr />
      <div style={{ display: "inline-flex" }}>
        <div className="events" style={{ width: "30%" }}>
          <Link to="new">+ Create New Event</Link>
          <h5>Your Events</h5>
          <ul>
            <li><Link to={"id12345"}>event 1</Link></li>
            <li><Link to={"id12345"}>event 2</Link></li>
            <li><Link to={"id12345"}>event 3</Link></li>
          </ul>
          <h5>Events You're Attending</h5>
          <ul>
            <li><Link to={"id12345"}>event 1</Link></li>
            <li><Link to={"id12345"}>event 2</Link></li>
            <li><Link to={"id12345"}>event 3</Link></li>
          </ul>
        </div>
        <div style={{ marginLeft: "50px", width: "70%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}