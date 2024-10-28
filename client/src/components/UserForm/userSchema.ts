import * as yup from "yup";

export const userSchema = yup.object().shape({
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE"], () => "Required")
    .required(),
  firstName: yup
    .string()
    .required("Required")
    .min(5, "First name must be at least 5 characters")
    .max(20, "First name must be at most 20 characters"),
  lastName: yup
    .string()
    .required("Required")
    .min(5, "Last name must be at least 5 characters")
    .max(20, "Last name must be at most 20 characters"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Required")
    .min(18, "Age must be at least 18")
    .test(
      "max-female-age",
      "Age must not be higher than 117 for females",
      (value, context) => {
        const { gender } = context.parent;
        if (gender === "FEMALE") return value <= 117;
        return true;
      }
    )
    .test(
      "max-male-age",
      "Age must not be higher than 112 for males",
      (value, context) => {
        const { gender } = context.parent;
        if (gender === "MALE") return value <= 112;
        return true;
      }
    ),
});
