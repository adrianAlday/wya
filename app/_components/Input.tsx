"use client";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
}: InputProps) => (
  <div className="my-4">
    {label && <label className="mb-1 text-sm font-semibold">{label}</label>}

    <input
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="border border-[#3d444d] focus:border-2 focus:border-[rgb(54,113,227)] focus:-m-px rounded-md w-full py-1 px-3 text-base"
    />
  </div>
);

export default Input;
