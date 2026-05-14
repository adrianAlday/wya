"use client";

type CopyToClipboardButtonProps = {
  text: string;
  children: React.ReactNode;
};

const CopyToClipboardButton = ({
  text,
  children,
}: CopyToClipboardButtonProps) => {
  const onClick = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button onClick={onClick} className="cursor-pointer">
      {children}
    </button>
  );
};

export default CopyToClipboardButton;
