import { ZodType, ZodError } from "zod";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

const zodToHookFormErrors = (zodError: ZodError): FieldErrors => {
  const errors: FieldErrors = {};
  for (const issue of zodError.issues) {
    const path = issue.path.join(".") || "root";
    errors[path] = {
      type: issue.code,
      message: issue.message,
    } as FieldError;
  }
  return errors;
};

export const customResolver = (schema: ZodType) => {
  return async (values: FieldValues) => {
    try {
      const result = await schema.safeParseAsync(values);
      if (result.success) {
        return { values: result.data as FieldValues, errors: {} };
      } else {
        return { values: {}, errors: zodToHookFormErrors(result.error) };
      }
    } catch (error) {
      return {
        values: {},
        errors: {
          root: {
            type: "unknown",
            message: "An unknown error occurred during validation",
          } as FieldError,
        },
      };
    }
  };
};
