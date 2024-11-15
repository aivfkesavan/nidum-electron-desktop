import { useId } from "react";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { cn } from "../../../../lib/utils";

type props = {
  name: string;
  label: string;
  registerProps?: RegisterOptions;
} & React.InputHTMLAttributes<HTMLInputElement>

function ControlledInput({ name, label, className, registerProps = {}, ...rest }: props) {
  const { register, formState: { errors } } = useFormContext()
  const id = useId()

  return (
    <div className="my-4">
      <label
        htmlFor={id}
        className="mb-0.5 text-xs opacity-70"
      >
        {label}
      </label>

      <input
        id={id}
        {...rest}
        {...register(name, {
          required: `${label} is required`,
          ...registerProps,
        })}
        className={cn("text-sm px-2 py-1.5 bg-transparent border", className)}
      />

      {errors[name] &&
        <p className="mt-0.5 text-xs text-red-400">
          {errors[name]?.message as string}
        </p>
      }
    </div>
  );
}

export default ControlledInput
