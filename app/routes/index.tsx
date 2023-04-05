import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="index">
      <h1>Welcome to Get Together</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non nobis exercitationem quo ad unde et enim reiciendis nisi autem nam voluptate labore veniam quidem, deserunt eos voluptas dolorum aliquam facilis!</p>
      <nav>
        <Link to='/login'>Login/Register</Link>
      </nav>
    </div>
  );
}