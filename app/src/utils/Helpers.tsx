export const runIntersectionObserver = (elem: HTMLElement | undefined) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => {
        entry.target.classList.add("scrolled");
        observer.unobserve(entry.target); // Stops observing after adding class
      });
  });

  if (!elem) {
    document.querySelectorAll(".element").forEach((elem) => {
      observer.observe(elem);
    });
  } else {
    observer.observe(elem);
  }

  return observer;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getUnit = (value: string | undefined) => {
  if (!value) return;
  const match = value.match(/[\d.\-+]*\s*(.*)/);
  return match ? match[1] : "";
};

export const makeArraySplitFrom = (
  str: string | undefined,
  splitValue: string,
): string[] => {
  if (!str) return [];

  const result: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of str) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    }

    if (char === splitValue && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current.trim());
  }

  return result;
};

export const updateOrDeleteAtIndex = (
  str: string,
  newVal: string | undefined,
  i: number,
  deletion: boolean,
  splitValue: string,
) => {
  const arr = makeArraySplitFrom(str, splitValue);

  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i");
    // Handle edge cases like undefined or invalid index
  }
  if (i >= arr.length) {
    throw Error("Index higher than split array's length"); // Index out of range
  }

  if (deletion) {
    arr.splice(i, 1); // Remove at the specified index
  } else if (newVal) {
    arr[i] = newVal; // Replace at the given index
  }
  return arr.join(splitValue); // Return updated string
};

export const getValueFromShorthandStr = (
  str: string | undefined,
  i: number | undefined,
) => {
  if (!str || i === undefined || i < 0) {
    return "";
  }

  const values = str.split(" "); // Split the shorthand string into individual values
  if (i >= values.length) {
    return "";
  }

  return values[i];
};

export const setValueFromShorthandStr = (
  str: string | undefined,
  i: number | undefined,
  newValue: string,
) => {
  if (!str || i === undefined || i < 0) {
    throw Error("Please pass in str and i"); // Handle edge cases like undefined or invalid index
  }

  const values = str.split(" "); // Split the shorthand string into individual values
  if (i >= values.length) {
    throw Error("Index higher than string values' length"); // Index out of range
  }

  values[i] = newValue; // Replace the value at the specified index

  return values.join(" "); // Recombine the values into a shorthand string
};

export const extractUrlValue = (cssUrl: string): string => {
  const match = cssUrl.match(/url\(["']?(.*?)["']?\)/);
  return match ? match[1] : "";
};

export function setCookie(name: string, value: string, exdays: number) {
  let cookie = `${name}=${encodeURIComponent(value)};path=/`;

  if (exdays > 0) {
    const expires = new Date(Date.now() + exdays * 864e5).toUTCString();

    cookie += `;expires=${expires}`;
  }

  document.cookie = cookie;
}

export const formatTime = (isoString: string) => {
  const localDate = new Date(isoString);
  const formatted = localDate.toLocaleString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatted;
};

const MAX_LABEL_LENGTH = 63;

export const addNumberWithDash = (slug: string, length: number) => {
  const suffix = length ? `-${length}` : "";
  const maxSlugLength = MAX_LABEL_LENGTH - suffix.length;

  const trimmedSlug = slug.slice(0, maxSlugLength);
  return trimmedSlug + suffix;
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace all non-url-safe characters with "-"
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes
}

export const returnErrorFromUnknown = (error: unknown) => {
  if (error instanceof Error && error.message) return { error: error.message };
  if (typeof error === "string" && error) return { error };
  return { error: "Unknown Error Occurred!" };
};
