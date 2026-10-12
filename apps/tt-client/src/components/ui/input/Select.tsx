import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

type Option = {
  label: string;
  value: string;
};

type Props = {
  value?: string;
  onValueChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  'data-testid'?: string;
};

export default function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select option',
  'data-testid': testId = 'select-trigger',
}: Props) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      {/* Trigger */}
      <SelectPrimitive.Trigger
        data-testid={testId}
        className="
        flex
        h-10
        w-full
        items-center
        justify-between
        rounded-button
        border
        border-white/[0.09]
        bg-surface-850/90
        px-3.5
        text-sm
        text-white
        backdrop-blur-md
        transition-all
        duration-200
        outline-none
        hover:border-white/[0.18]
        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
      "
      >
        <SelectPrimitive.Value placeholder={placeholder} />

        <SelectPrimitive.Icon>
          <ChevronDown size={16} className="text-slate-400" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {/* Dropdown Content */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          sideOffset={6}
          position="popper"
          className="
          z-50
          min-w-[200px]
          overflow-hidden
          rounded-card
          border
          border-white/[0.12]
          bg-surface-850/95
          p-1.5
          shadow-panel
          backdrop-blur-2xl
          animate-in
          fade-in-80
          zoom-in-95
        "
        >
          <SelectPrimitive.Viewport className="space-y-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                data-testid={`select-option-${option.value}`}
                className="
                  relative
                  flex
                  cursor-pointer
                  select-none
                  items-center
                  rounded-button
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-slate-300
                  outline-none
                  transition-colors
                  hover:bg-white/[0.08]
                  hover:text-white
                  focus:bg-white/[0.08]
                  focus:text-white
                  data-[state=checked]:bg-primary/20
                  data-[state=checked]:text-primary
                "
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>

                <SelectPrimitive.ItemIndicator className="absolute right-3 text-primary">
                  <Check size={14} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}