import { getEventItem, updateEventItem } from "~/models/eventItems.server";
import { useEffect, useRef } from "react";
import { requireUserId } from "~/session.server";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const { eventItemId } = params;
  if (!eventItemId) {
    throw new Response("Uh Oh! There was no id.", { status: 404 });
  }
  const eventItem = await getEventItem(eventItemId);
  if (!eventItem) {
    throw new Response("Uh Oh! No event found.", { status: 404 });
  }

  return json({ eventItem });
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.eventItemId, "eventItemId not found");

  const eventId = params.eventId;
  if (!eventId) {
    throw new Response("Uh Oh! No eventId found.", { status: 404 });
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const note = formData.get("note");

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { note: null, name: "Item name is required" } },
      { status: 400 }
    );
  }
  if (typeof note !== "string" || note.length === 0) {
    return json(
      { errors: { note: "Description is required", name: null } },
      { status: 400 }
    );
  }

  const id = params.eventItemId;
  const updatedEventItem = await updateEventItem({ id, name, note, eventId });

  return redirect(`/events/${eventId}`);
};

export default function UpdateEventItemRoute() {
  const data = useLoaderData();
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.note) {
      noteRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            name="name"
            defaultValue={data.eventItem.name}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.name && (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData.errors.name}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Note: </span>
          <textarea
            ref={noteRef}
            name="note"
            defaultValue={data.event.note}
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.note ? true : undefined}
            aria-errormessage={
              actionData?.errors?.note ? "note-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.note && (
          <div className="pt-1 text-red-700" id="note-error">
            {actionData.errors.note}
          </div>
        )}
      </div>

      <div className="text-right">
        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
          Save
        </button>
      </div>
    </Form>
  );
}
