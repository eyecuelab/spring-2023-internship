export default function NewEventRoute() {
  return (
    <div>
      <p>Create a new event</p>
      <form method="post">
        <div>
          <label>
            Title: <input type="text" name="title" />
          </label>
        </div>
        <div>
          <label>
            Description: <textarea name="description" />
          </label>
        </div>
        <div>
          <label>
            Address: <input type="text" name="address" />
          </label>
        </div>
        <div>
          <label>
            Event Date and Time: <input type="datetime-local" name="datetime" />
          </label>
        </div>
        <div>
          <button type="submit" className="button">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}