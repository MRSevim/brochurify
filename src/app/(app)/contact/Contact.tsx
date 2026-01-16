"use client";
import Container from "@/components/Container";
import { submitAction } from "./submitAction";
import { useActionState } from "react";
import Alert from "@/components/Alert";

export type ContactState = {
  error: string;
  successMessage: string;
  defaultValues?: {
    name: string;
    email: string;
    message: string;
  };
};

const initialState: ContactState = {
  error: "",
  successMessage: "",
};

const popupClasses = "text-center mt-2 p-3";

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitAction, initialState);

  return (
    <Container className="max-w-xl mx-auto p-6 bg-background text-text rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Contact</h2>
      <form action={action}>
        <div className="mb-4">
          <label htmlFor="name" className="block  font-semibold mb-2">
            Name
          </label>
          <input
            defaultValue={state.defaultValues?.name}
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full p-3 border border-text rounded-md focus:outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-2">
            Email
          </label>
          <input
            defaultValue={state.defaultValues?.email}
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full p-3 border rounded-md focus:outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block font-semibold mb-2">
            Message
          </label>
          <textarea
            defaultValue={state.defaultValues?.message}
            name="message"
            id="message"
            placeholder="Your Message"
            required
            rows={4}
            className="w-full p-3 border rounded-md focus:outline"
          />
        </div>
        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-text text-background py-3 rounded-md transition duration-300 disabled:bg-zinc-700 disabled:text-gray-500 dark:disabled:bg-gray-800/20"
        >
          Send Message
        </button>
        {state.successMessage && (
          <Alert className={popupClasses} text={state.successMessage} />
        )}
        {state.error && (
          <Alert
            className={popupClasses}
            text={state.successMessage}
            type="error"
          />
        )}
      </form>
    </Container>
  );
}
