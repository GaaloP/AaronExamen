const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(value: string): boolean {
  const atCount = (value.match(/@/g) || []).length;
  return atCount === 1 && EMAIL_REGEX.test(value);
}