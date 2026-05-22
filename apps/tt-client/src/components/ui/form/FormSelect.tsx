import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import FormField from './FormField';
import Select from '../input/Select';

type Option = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: Option[];
};

export default function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            options={options}
          />
        </FormField>
      )}
    />
  );
}
