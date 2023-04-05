import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server"

export const loader = async ({ request }: LoaderArgs ) => {
  // vvvvv---requireUserId() needs to be created in session.server.ts---vvvvv
  // const userId = await requireUserId(request);
  // vvvvv---getEventList() needs to be created in models. Using userID to begin?---vvvvv 
  // const eventList = await getEventList({ userId });
  // return json({ eventList });

  const eventList = await prisma.event.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" }
  });

  return json({ eventList })
}

export default function EventsRoute() {
  const data = useLoaderData<typeof loader>();
  // vvvvv---useUser() needs to be created in utils---vvvvv
  // const user = useUser();

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
            {data.eventList.map((event: any) => (
              <li key={event.id}>
                <Link to={event.id}>{event.title}</Link>
              </li>
            ))}
          </ul>
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