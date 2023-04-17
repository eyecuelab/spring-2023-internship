// import type { ActionArgs } from "@remix-run/node";
// import { json, redirect } from "@remix-run/node";
// import { Form, useActionData } from "@remix-run/react";
// import { createEventItem } from "~/models/eventItems.server";
// import { useEffect, useRef } from "react";
// import { requireUserId } from "~/session.server";
// import invariant from "tiny-invariant";


// export const action = async ({ request, params }: ActionArgs) => {
//   const userId = await requireUserId(request);  
//   invariant(params.eventId, "eventId not found");


//   const formData = await request.formData();
//   const name = formData.get("name");
//   const note = formData.get("note");

//   if (typeof name !== "string" || name.length === 0) {
//     return json(
//       { errors: { note: null, name: "Name is required" } },
//       { status: 400 }
//     );
//   }
//   if (typeof note !== "string" || note.length === 0) {
//     return json(
//       { errors: { note: "Note is required", name: null } },
//       { status: 400 }
//     );
//   }

//   const eventId = params.eventId;
//   const eventItem = await createEventItem({ name, note, eventId });

//   return redirect(`/events/${eventId}`);
// }

// export default function NewEventRoute() {
//   const actionData = useActionData<typeof action>();
//   const nameRef = useRef<HTMLInputElement>(null);
//   const noteRef = useRef<HTMLTextAreaElement>(null);

//   useEffect(() => {
//     if (actionData?.errors?.name) {
//       nameRef.current?.focus();
//     } else if (actionData?.errors?.note) {
//       noteRef.current?.focus();
//     }
//   }, [actionData]);

//   return (
//     <Form
//       method="post"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 8,
//         width: "100%",
//       }}
//     >
//       <div>
//         <label className="flex w-full flex-col gap-1">
//           <span>name: </span>
//           <input
//             ref={nameRef}
//             name="name"
//             className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
//             aria-invalid={actionData?.errors?.name ? true : undefined}
//             aria-errormessage={
//               actionData?.errors?.name ? "name-error" : undefined
//             }
//           />
//         </label>
//         {actionData?.errors?.name && (
//           <div className="pt-1 text-red-700" id="name-error">
//             {actionData.errors.name}
//           </div>
//         )}
//       </div>

//       <div>
//         <label className="flex w-full flex-col gap-1">
//           <span>note: </span>
//           <textarea
//             ref={noteRef}
//             name="note"
//             rows={8}
//             className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
//             aria-invalid={actionData?.errors?.note ? true : undefined}
//             aria-errormessage={
//               actionData?.errors?.note ? "note-error" : undefined
//             }
//           />
//         </label>
//         {actionData?.errors?.note && (
//           <div className="pt-1 text-red-700" id="note-error">
//             {actionData.errors.note}
//           </div>
//         )}
//       </div>

//       <div className="text-right">
//         <button
//           type="submit"
//           className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
//         >
//           Save
//         </button>
//       </div>
//     </Form>
//   );
// }