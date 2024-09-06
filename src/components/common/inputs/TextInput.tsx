import Exclamation from "app/components/icons/Exclamation";
import clsx from "clsx";
import React from "react";

export interface TextInputProps {
  label: string;
  value?: string;
  type?: HTMLInputElement["type"];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  error?: boolean;
  inputRef?: React.Ref<any>;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, type, inputRef, onChange = () => undefined, helperText, error, placeholder }) => {
  return (
    <div className="w-full">
      <div className="relative h-[50px] w-full min-w-[200px]">
        {error && (
          <div className="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center text-white">
            <Exclamation />
          </div>
        )}
        <label>
          <input
            ref={inputRef}
            className={clsx(
              "peer h-full w-full rounded border border-t-transparent border-white bg-transparent px-3.5 py-4 !pr-9 font-sans text-sm font-normal text-white outline outline-0 transition-none",
              "hover:border-2",
              "placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white",
              "focus:border-4 focus:border-white focus:border-t-transparent focus:outline-0",
            )}
            placeholder={placeholder || " "}
            onChange={onChange}
            value={value}
            type={type || "text"}
            aria-invalid={error ? "true" : undefined}
          />
          <div
            className={clsx(
              "pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-white transition-all",
              "before:content[' '] before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl before:border-t before:border-l before:border-white before:transition-none",
              "after:content[' '] after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:border-t after:rounded-tr after:border-r after:border-white after:transition-none",
              "peer-placeholder-shown:text-[16px] peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-white peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent",
              "peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-t-4 peer-focus:before:border-l-4 peer-focus:before:border-white peer-focus:after:border-t-4 peer-focus:after:border-r-4 peer-focus:after:border-white",
              "peer-hover:before:border-t-2 peer-hover:before-l-2 peer-hover:after:border-t-2 peer-hover:after:border-r-2",
            )}
          >
            {label}
          </div>
        </label>
      </div>
      <p className="px-3.5 mt-1">{helperText}</p>
    </div>
  );
};

export default TextInput;
