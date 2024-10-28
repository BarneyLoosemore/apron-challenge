import { Control, useController, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import "./UserForm.css";
import { Icon } from "../Icon";
import { InferType } from "yup";
import { userSchema } from "./userSchema";

export type UserSchema = InferType<typeof userSchema>;

type UserFormProps = {
  formTitle: string;
  onSubmit: (data: UserSchema) => void;
  submitButtonText: string;
  defaultValues?: Partial<UserSchema>;
  closeDialog: () => void;
};

export const UserForm = ({
  formTitle,
  onSubmit,
  submitButtonText,
  defaultValues,
  closeDialog,
}: UserFormProps) => {
  const { handleSubmit, control, reset, watch, trigger } = useForm<UserSchema>({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const gender = watch("gender");
  const age = watch("age");
  useEffect(() => {
    if (gender && age) trigger("age"); // re-validate age when gender changes
  }, [gender, age, trigger]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        onClick={closeDialog}
        type="button"
        className="close-dialog-button"
        aria-label="Close dialog">
        <Icon name="close" />
      </button>
      <h2>{formTitle}</h2>
      <Select
        name="gender"
        label="Gender"
        options={["Male", "Female"]}
        control={control}
      />
      <Input name="firstName" label="First name" control={control} />
      <Input name="lastName" label="Last name" control={control} />
      <Input name="age" label="Age" control={control} />
      <button type="button" onClick={closeDialog} className="cancel-button">
        Cancel
      </button>
      <button type="submit" className="submit-button">
        {submitButtonText}
      </button>
    </form>
  );
};

const Input = ({
  name,
  label,
  control,
}: {
  name: keyof UserSchema;
  label: string;
  control: Control<UserSchema>;
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: "",
  });

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} className={fieldState.error && "error"} {...field} />
      <p className="error-message">{fieldState?.error?.message}</p>
    </div>
  );
};

const Select = ({
  name,
  label,
  options,
  control,
}: {
  name: keyof UserSchema;
  label: string;
  options: string[];
  control: Control<UserSchema>;
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: "",
  });

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} className={fieldState.error && "error"} {...field}>
        <option value=""></option>
        {options.map((option) => (
          <option key={option} value={option.toUpperCase()}>
            {option}
          </option>
        ))}
      </select>
      <p className="error-message">{fieldState?.error?.message}</p>
    </div>
  );
};
