"use server";

export const submitForm = async (formData: FormData) => {
  const res = await fetch(`${process.env.FORMSPREE_FORM_URL}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
  const json = await res.json();

  if (!res.ok) {
    return { error: json.error || "Something went wrong", successMessage: "" };
  }
  return { error: "", successMessage: "Thank you for your message..." };
};
