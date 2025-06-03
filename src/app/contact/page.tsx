"use client";
import Container from "@/components/Container";
import { submitAction } from "./submitAction";
import { useState } from "react";

const initialState = {
  error: "",
  successMessage: "",
};

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState(initialState);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setState(initialState);
    const formData = new FormData(e.currentTarget);
    const state = await submitAction(formData);
    setState(state);
    setIsPending(false);
  };

  return (
    <Container>
      <div className="max-w-xl mx-auto p-6 bg-background text-text rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block  font-semibold mb-2">
              Name
            </label>
            <input
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
            <div
              className="text-center mt-2 p-3 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-600"
              role="alert"
            >
              <span className="font-small">{state.successMessage}</span>
            </div>
          )}
          {state.error && (
            <div
              className="text-center mt-2 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-600"
              role="alert"
            >
              <span className="font-small">{state.error}</span>
            </div>
          )}
        </form>
      </div>
    </Container>
  );
}
