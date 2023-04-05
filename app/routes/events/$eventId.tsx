import { Outlet } from "@remix-run/react";

export default function EventRoute() {
  return (
    <div>
      <h1>Event Info</h1>
      <hr />
      <h3>Event Title</h3>
      <p>Desciprion: Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta impedit officia magnam eligendi, at earum voluptates nobis esse consequatur provident corporis accusantium minima aliquam officiis quisquam incidunt ipsa facere natus!</p>
      <h4>1234 Address St. Portland, OR 97211</h4>
      <h4>5/01/23 -- 5:00pm</h4>
      <hr />
      <Outlet />
    </div>
  )
}