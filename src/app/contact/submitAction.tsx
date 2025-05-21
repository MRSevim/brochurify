"use server";

export const submitAction = async (formData: FormData) => {
  try {
    const res = await fetch(`${process.env.FORMSPREE_FORM_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      throw Error(json.error || "Something went wrong");
    }
    return { error: "", successMessage: "Thank you for your message..." };
  } catch (error: any) {
    return { error: error.message, successMessage: "" };
  }
};
