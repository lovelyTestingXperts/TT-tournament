type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(props: Props) {
  const testId = (props as any)['data-testid'] || (props.name ? `${props.name}-input` : undefined);

  return (
    <textarea
      id={props.id || (props.name ? `textarea-${props.name}` : undefined)}
      data-testid={testId}
      className="
      min-h-[120px]
      w-full
      rounded-button
      border
      border-white/10
      bg-slate-900/60
      p-4
      text-white
      backdrop-blur-xl
      placeholder:text-slate-500
      outline-none
      focus:border-primary
      focus:ring-2
      focus:ring-primary/20
      "
      {...props}
    />
  );
}