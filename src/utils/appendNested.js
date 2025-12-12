export function appendNested(form, prefix, obj) {
  if (!obj || typeof obj !== 'object') return;

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Array → bracketed indexed structure
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (item === undefined || item === null) return;
        if (typeof item === 'object') {
          // recurse for objects inside arrays
          appendNested(form, `${prefix}[${key}][${idx}]`, item);
        } else {
          form.append(`${prefix}[${key}][${idx}]`, String(item));
        }
      });
    }
    // Object → recurse
    else if (typeof value === 'object') {
      appendNested(form, `${prefix}[${key}]`, value);
    }
    // Primitive
    else {
      form.append(`${prefix}[${key}]`, String(value));
    }
  });
}
