import * as SelectPrimitive from '@radix-ui/react-select';
import {
  Check,
  ChevronDown,
} from 'lucide-react';

type Option = {
  label: string;
  value: string;
};

type Props = {
  value?: string;
  onValueChange?: (
    value: string
  ) => void;
  options: Option[];
  placeholder?: string;
};

export default function Select({
  value,
  onValueChange,
  options,
  placeholder =
    'Select option',
}: Props) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={
        onValueChange
      }
    >
      {/* Trigger */}
      <SelectPrimitive.Trigger
        className="
        flex
        h-14
        w-full
        items-center
        justify-between
        rounded-[22px]
        border
        border-white/10
        bg-white/10
        px-5
        text-white
        backdrop-blur-2xl
        transition-all
        duration-300
        outline-none
        hover:bg-white/15
        focus:border-violet-400/40
        focus:bg-white/15
        focus:ring-4
        focus:ring-violet-500/20
      "
      >
        <SelectPrimitive.Value
          placeholder={
            placeholder
          }
        />

        <SelectPrimitive.Icon>
          <ChevronDown
            size={18}
            className="text-white/60"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {/* Dropdown */}
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          sideOffset={10}
          position="popper"
          className="
          z-50
          min-w-[220px]
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-white/10
          p-2
          shadow-2xl
          backdrop-blur-[30px]
          animate-in
          fade-in
          zoom-in-95
        "
        >
          <SelectPrimitive.Viewport className="space-y-1">
            {options.map(
              (option) => (
                <SelectPrimitive.Item
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                  className="
                  relative
                  flex
                  cursor-pointer
                  select-none
                  items-center
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white/75
                  outline-none
                  transition-all
                  duration-200
                  hover:bg-white/10
                  hover:text-white
                  focus:bg-white/10
                  focus:text-white
                  data-[state=checked]:bg-white/10
                  data-[state=checked]:text-white
                "
                >
                  <SelectPrimitive.ItemText>
                    {
                      option.label
                    }
                  </SelectPrimitive.ItemText>

                  <SelectPrimitive.ItemIndicator
                    className="
                    absolute
                    right-4
                  "
                  >
                    <Check
                      size={16}
                    />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              )
            )}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}