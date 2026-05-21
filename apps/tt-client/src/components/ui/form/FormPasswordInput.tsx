import {
  Control,
  Controller,
  FieldValues,
  Path,
} from 'react-hook-form';

import PasswordInput from '../input/PasswordInput';
import FormField from './FormField';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
};

export default function FormPasswordInput<
  T extends FieldValues
>({
  name,
  control,
  label,
  placeholder,
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
          <PasswordInput
            {...field}
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