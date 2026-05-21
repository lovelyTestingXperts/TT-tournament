import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form';

import Input from '../input/Input';
import FormField from './FormField';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
};

export default function FormInput<
  T extends FieldValues
>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => (
        <FormField
          label={label}
          error={
            fieldState.error
              ?.message
          }
        >
          <Input
            {...field}
            type={type}
            placeholder={
              placeholder
            }
            error={
              fieldState.error
                ?.message
            }
          />
        </FormField>
      )}
    />
  );
}