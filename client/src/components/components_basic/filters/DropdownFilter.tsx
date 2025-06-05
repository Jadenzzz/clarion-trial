import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import useEsc from "@/hooks/useEsc";
import useOutsideClick from "@/hooks/useOutsideClick";
import pluralize from "pluralize";
import { ChevronDownIcon, TrashIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface SourcingTableDropdownFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SourcingTableDropdownFilterProps {
  label: string;
  width?: string;
  placeholder?: string;
  options: SourcingTableDropdownFilterOption[];
  values: string[];
  loading?: boolean;
  onChange: (values: string[]) => void;
}

export default function SourcingTableDropdownFilter({
  label,
  width,
  options,
  values,
  onChange,
  loading = false,
}: SourcingTableDropdownFilterProps) {
  const [open, setOpen] = useState(false);

  const filtered_options = options
    .sort((a, b) => {
      return (b.count ?? 0) - (a.count ?? 0);
    })
    .slice(0, 100);

  const ref = useRef<HTMLDivElement>(null);

  const [button_hover, setButtonHover] = useState(false);
  const [x_hover, setXHover] = useState(false);

  useOutsideClick(ref, () => {
    setOpen(false);
    setButtonHover(false);
    setXHover(false);
  });

  useEsc({
    onClose: () => {
      setOpen(false);
    },
  });

  return (
    <div className="relative dropdown" ref={ref}>
      <button
        className={`border text-xs  h-full flex gap-1 items-center ${
          x_hover
            ? "border-red-500 text-red-500 bg-red-50 "
            : values.length > 0
            ? "border-blue-500 text-blue-500 bg-blue-50 "
            : " hover:border-neutral-200 hover:bg-neutral-100 border-neutral-200 "
        }
justify-center rounded-xl px-2.5 select-none py-1 transition-all whitespace-nowrap disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
        onClick={() => {
          if (x_hover) setOpen(false);
          else setOpen(!open);
        }}
        tabIndex={0}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        <span>
          {values.length > 0
            ? `${values.length} ${pluralize(label, values.length)} selected`
            : label}
        </span>
        <AnimatePresence>
          {button_hover && values.length > 0 ? (
            <motion.div
              className={`w-3 h-3 ${
                x_hover
                  ? "text-red-500"
                  : values.length > 0
                  ? "text-blue-500"
                  : "text-neutral-700"
              } flex items-center justify-center cursor-pointer`}
              onMouseEnter={() => setXHover(true)}
              onMouseLeave={() => setXHover(false)}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                onChange([]);
                setButtonHover(false);
                setXHover(false);
              }}
            >
              <TrashIcon className="h-full w-full" />
            </motion.div>
          ) : (
            <motion.div
              className={`w-3 h-3 ${
                values.length > 0 ? "text-blue-500" : "text-neutral-700"
              } flex items-center justify-center`}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{
                opacity: 1,
                rotate: open ? 180 : 0,
                marginTop: open ? "0px" : "2.125px",
                transition: {
                  duration: 0.1,
                },
              }}
            >
              <ChevronDownIcon className="h-full w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute z-[999] drop-shadow-lg top-9 bg-white bottom-0 left-0 text-sm rounded-lg ${
              width ? width : "w-[330px]"
            } divide-y divide-neutral-200`}
          >
            <div className="flex flex-row items-center justify-start gap-2 h-fit bg-white p-2 rounded-t-lg border-t border-x border-neutral-200">
              <div className="text-sm">{label}</div>
            </div>

            <div
              className={`overflow-y-auto overscroll-none max-h-[400px] rounded-b-lg border-x border-b border-neutral-200`}
            >
              {filtered_options.length > 0 ? (
                filtered_options.map((option, index) => (
                  <div
                    className="bg-white g roup relative cursor-pointer z-50 select-none whitespace-nowrap hover:bg-neutral-100 p-2 text-sm flex flex-row items-center transition-all"
                    key={index}
                    onClick={() => {
                      onChange(
                        values.includes(option.value)
                          ? values.filter(
                              (value: any) => value !== option.value
                            )
                          : [...values, option.value]
                      );
                    }}
                  >
                    <Checkbox
                      checked={values.includes(option.value)}
                      onCheckedChange={() => {
                        onChange(
                          values.includes(option.value)
                            ? values.filter(
                                (value: any) => value !== option.value
                              )
                            : [...values, option.value]
                        );
                      }}
                    />
                    <div
                      className="ml-2 text-xs"
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        display: "block",
                        overflow: "hidden",
                      }}
                    >
                      {option.label}
                    </div>
                    {option.count ? (
                      <div className="text-xs text-neutral-500 ml-1 rounded-md px-1 border">
                        {option.count}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="select-none p-2 text-sm border-b bg-white flex items-center justify-center h-[200px] rounded-b-lg">
                  {loading ? "Loading..." : "No results"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
