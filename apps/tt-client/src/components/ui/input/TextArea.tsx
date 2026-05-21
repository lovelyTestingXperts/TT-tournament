type Props =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(
  props: Props
) {
  return (
    <textarea
      className="
      min-h-[120px]
      w-full
      rounded-2xl
      border
      border-white/10
      bg-white/10
      p-4
      text-white
      backdrop-blur-xl
      placeholder:text-white/40
      outline-none
      focus:ring-4
      focus:ring-violet-500/20
      "
      {...props}
    />
  );
}