import { useId } from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

type props = {
  name: string;
  label: string;
  list: {
    id: string
    name: string
  }[]
  placeholder?: string
  registerProps?: RegisterOptions;
}

function ControlledSelect({ name, label, list, placeholder = "Model", registerProps }: props) {
  const id = useId()
  const { control, formState: { errors } } = useFormContext()

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-0.5 text-xs opacity-70"
      >
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} is required`,
          ...registerProps,
        }}
        render={({ field: { value, onChange } }) => (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id={id} className="h-8">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className=" max-h-60">
              {
                list.map(m => (
                  <SelectItem
                    value={m.id}
                    key={m.id}
                  >
                    {m.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        )}
      />

      {errors[name] &&
        <p className="mt-0.5 text-xs text-red-400">
          {errors[name]?.message as string}
        </p>
      }
    </div>
  )
}

export default ControlledSelect
