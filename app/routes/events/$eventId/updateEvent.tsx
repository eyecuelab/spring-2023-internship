import { getEvent, updateEvent } from "~/models/events.server";
import { useEffect, useRef } from "react";
import { requireUserId } from "~/session.server";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  const { eventId } = params;
  if (!eventId) {
    throw new Response("Uh Oh! There was no id.", {status: 404})
  }
  const event = await getEvent(eventId);
  if (!event) {
    throw new Response("Uh Oh! No event found.", {status: 404});
  }
  return json({ event });
}

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await requireUserId(request);  
  invariant(params.eventId, "eventId not found");

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const address = formData.get("address");
  const date = formData.get("datetime");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { description: null, title: "Title is required", address: null, datetime: null } },
      { status: 400 }
    );
  }
  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Description is required", title: null, address: null, datetime: null } },
      { status: 400 }
    );
  }
  if (typeof address !== "string" || address.length === 0) {
    return json(
      { errors: { description: null, title: null, address: "Address is required", datetime: null } },
      { status: 400 }
    );
  }
  if (typeof date !== "string" || date.length === 0) {
    return json(
      { errors: { description: null, title: null, address: null, datetime: "Date and Time is required" } },
      { status: 400 }
    );
  }
  
  const id = params.eventId;
  const dateTime = new Date(date);
  const updatedEvent = await updateEvent({ id, title, description, address, dateTime, userId });

  return redirect(`/events/${updatedEvent.id}`);
}

export default function UpdateEventRoute() {
  const data = useLoaderData();
  const dateTime = new Date(data.event.dateTime);

  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const datetimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.errors?.address) {
      addressRef.current?.focus();
    } else if (actionData?.errors?.datetime) {
      datetimeRef.current?.focus();
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
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            defaultValue={data.event.title}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            defaultValue={data.event.description}
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData.errors.description}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Address: </span>
          <input
            ref={addressRef}
            name="address"
            defaultValue={data.event.address}
            aria-invalid={actionData?.errors?.address ? true : undefined}
            aria-errormessage={
              actionData?.errors?.address ? "address-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.address && (
          <div className="pt-1 text-red-700" id="address-error">
            {actionData.errors.address}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Date and Time: </span>
          <input
            ref={datetimeRef}
            type="datetime-local"
            name="datetime"
            defaultValue={data.event.dateTime.slice(0, data.event.dateTime.length - 1)}
            aria-invalid={actionData?.errors?.datetime ? true : undefined}
            aria-errormessage={
              actionData?.errors?.datetime ? "datetime-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.datetime && (
          <div className="pt-1 text-red-700" id="datetime-error">
            {actionData.errors.datetime}
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
