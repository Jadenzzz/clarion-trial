import { useQuery } from "@tanstack/react-query";

import type { Call } from "@/public /types/call";
import type { ColumnDef } from "@tanstack/react-table";
import TableView from "@/components/TableView";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slideover from "@/components/components_basic/Slideover";
import CallReportView from "@/components/components_basic/calls/CallReportView";
import {
  CALL_TYPE_TO_COLOR,
  CALL_TYPE_TO_ICON,
  CALL_TYPE_TO_TEXT,
} from "@/utils/constants";
import React from "react";
import dayjs from "dayjs";
import { formatCallEndedReason } from "@/utils";
import Badge from "@/components/components_basic/Badge";
import {
  Check,
  ChevronDownIcon,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DropdownFilter from "@/components/components_basic/filters/DropdownFilter";
import { motion } from "motion/react";
import Loader from "@/components/components_basic/Loader";
const getCalls = async (): Promise<Call[]> => {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/calls");
  return res.json();
};

function CallsTable() {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);

  const [bulk_actions_open, setBulkActionsOpen] = useState<boolean>(false);
  const bulk_action_ref = useRef<HTMLButtonElement | null>(null);
  const [show_selected, setShowSelected] = useState<boolean>(false);

  const [selected_call_id, setSelectedCallId] = useState<string | null>(null);
  const [selected_row_ids, setSelectedRowIds] = useState<string[]>([]);
  const [selected_assistant_ids, setSelectedAssistantIds] = useState<string[]>(
    []
  );
  const [selected_call_type, setSelectedCallType] = useState<string[]>([]);
  const [selected_ended_reason, setSelectedEndedReason] = useState<string[]>(
    []
  );
  const [search_string, setSearchString] = useState<string>("");
  // const [selected_success, setSelectedSuccess] = useState<boolean>(false);

  const { data, isLoading: is_loading } = useQuery({
    queryKey: ["calls"],
    queryFn: getCalls,
  });

  useEffect(() => {
    const call_id = params.get("call_id");
    if (call_id) {
      setSelectedCallId(call_id);
    } else {
      setSelectedCallId(null);
    }
  }, [params, setSelectedCallId]);

  const mapped_data = useMemo(
    () =>
      data
        ?.map((call) => ({
          ...call,
          success: !call.ended_reason?.includes("error"),
          assistant_name: call.assistant.name,
          summary: call.summary,
          duration: call.ended_at
            ? dayjs(call.ended_at).diff(dayjs(call.started_at), "seconds")
            : null,
        }))
        .filter((call) => {
          if (selected_assistant_ids.length > 0) {
            return selected_assistant_ids.includes(call.assistant_id);
          }
          return true;
        })
        .filter((call) => {
          if (selected_call_type.length > 0) {
            return selected_call_type.includes(call.type);
          }
          return true;
        })
        .filter((call) => {
          if (selected_ended_reason.length > 0 && call.ended_reason) {
            return selected_ended_reason.includes(call.ended_reason);
          }
          return true;
        })
        .filter((call) => {
          if (show_selected && selected_row_ids.length > 0) {
            return selected_row_ids.includes(call.id);
          }
          return true;
        })
        .filter((call) => {
          if (search_string) {
            return (
              call.vapi_id
                .toLowerCase()
                .includes(search_string.toLowerCase()) ||
              call.assistant_name
                .toLowerCase()
                .includes(search_string.toLowerCase()) ||
              call.summary
                ?.toLowerCase()
                .includes(search_string.toLowerCase()) ||
              formatCallEndedReason(call.ended_reason || "")
                .toLowerCase()
                .includes(search_string.toLowerCase())
            );
          }
          return true;
        }),
    [
      data,
      selected_assistant_ids,
      selected_call_type,
      selected_ended_reason,
      show_selected,
      selected_row_ids,
      search_string,
    ]
  );

  const [table_data, setTableData] = useState<NonNullable<typeof mapped_data>>(
    []
  );

  useEffect(() => {
    setTableData(mapped_data || []);
  }, [mapped_data]);

  //tooltip helper

  const tooltip_ref = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent, content: string) => {
    if (
      !tooltip_ref.current ||
      !content ||
      content === "N/A" ||
      content.length <= 29
    )
      return;

    tooltip_ref.current.style.display = "block";
    tooltip_ref.current.innerHTML = content;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const offset = 3;

    let left = rect.left;
    let top = rect.bottom + offset;

    // Ensure tooltip stays within viewport
    const tooltip_width = tooltip_ref.current.offsetWidth;
    const tooltip_height = tooltip_ref.current.offsetHeight;

    if (left + tooltip_width > window.innerWidth) {
      left = window.innerWidth - tooltip_width - offset;
    }

    if (top + tooltip_height > window.innerHeight) {
      top = rect.top - tooltip_height - offset;
    }

    tooltip_ref.current.style.left = `${left}px`;
    tooltip_ref.current.style.top = `${top}px`;
  };

  const handleMouseLeave = () => {
    if (tooltip_ref.current) {
      tooltip_ref.current.style.display = "none";
    }
  };

  const table_columns: ColumnDef<NonNullable<typeof mapped_data>[number]>[] = [
    {
      id: "vapi_id",
      header: "Call ID",
      accessorKey: "vapi_id",
      size: 150,
      minSize: 150,
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.vapi_id;
        const b = rowB.original.vapi_id;
        if (a && b) {
          return a.localeCompare(b);
        }
        if (a === b) return 0;
        return (a || "") < (b || "") ? -1 : 1;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={selected_row_ids.includes(row.original.id)}
                onCheckedChange={(checked) => {
                  setSelectedRowIds(
                    checked
                      ? [...selected_row_ids, row.original.id]
                      : selected_row_ids.filter((id) => id !== row.original.id)
                  );
                }}
              />
              <div
                className="text-sm font-medium cursor-pointer underline truncate max-w-[100px]"
                onClick={() => {
                  params.set("call_id", row.original.id);
                  navigate(`${pathname}?${params.toString()}`);
                }}
              >
                {row.original.vapi_id}
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "assistant_id",
      header: "Assistant ",
      accessorKey: "assistant_id",
      size: 280,
      minSize: 280,
      cell: ({ row }) => {
        return (
          <div className="text-sm font-light">
            {row.original.assistant.name}
            <div className="text-xs font-light">
              {row.original.assistant_id}
            </div>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      size: 120,
      minSize: 120,
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.type;
        const b = rowB.original.type;
        if (a && b) {
          return a.localeCompare(b);
        }
        if (a === b) return 0;
        return (a || "") < (b || "") ? -1 : 1;
      },
      cell: ({ row }) => {
        const icon =
          CALL_TYPE_TO_ICON[
            row.original.type as keyof typeof CALL_TYPE_TO_ICON
          ];
        const text =
          CALL_TYPE_TO_TEXT[
            row.original.type as keyof typeof CALL_TYPE_TO_TEXT
          ];
        const color =
          CALL_TYPE_TO_COLOR[
            row.original.type as keyof typeof CALL_TYPE_TO_COLOR
          ];
        return (
          <div>
            <Badge
              text={text}
              bg_color={color}
              padding="px-2 py-0.5"
              icon={icon}
              text_size="text-xs"
              icon_size="w-3 h-3"
            />
          </div>
        );
      },
    },

    {
      id: "summary",
      header: "Summary",
      accessorKey: "summary",
      size: 300,
      minSize: 300,
      cell: ({ row }) => {
        return (
          <div
            className="text-sm max-w-[300px] truncate"
            onMouseEnter={(e) => {
              if (row.original.summary) {
                handleMouseEnter(e, row.original.summary);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            {row.original.summary}
          </div>
        );
      },
    },
    {
      id: "ended_reason",
      header: "Ended Reason",
      accessorKey: "ended_reason",
      size: 300,
      minSize: 300,
      cell: ({ row }) => {
        const text = formatCallEndedReason(row.original.ended_reason || "");

        const color = row.original.success ? "green" : "red";

        return (
          <div>
            <Badge
              text={text}
              bg_color={color}
              padding="px-2 py-0.5"
              text_size="text-xs"
            />
          </div>
        );
      },
    },

    {
      id: "success",
      header: "Success",
      accessorKey: "success",
      size: 120,
      minSize: 120,
      cell: ({ row }) => {
        const icon = row.original.success ? CircleCheck : CircleX;
        // const text = row.original.transcript ? "Yes" : "No";
        return (
          <div>
            {React.createElement(icon, {
              className: `w-4 h-4 ${
                row.original.success ? "text-green-500" : "text-red-500"
              }`,
            })}
          </div>
        );
      },
    },
    {
      id: "cost",
      header: "Cost",
      accessorKey: "cost",
      size: 120,
      minSize: 120,
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            ${row.original.cost?.toFixed(2) || "0.00"}
          </div>
        );
      },
    },
    {
      id: "duration",
      header: "Duration",
      accessorKey: "duration",
      size: 120,
      minSize: 120,
      cell: ({ row }) => {
        const duration = row.original.duration;
        if (duration === null || duration === undefined) {
          return <p className="text-sm">-</p>;
        }
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return (
          <p className="text-sm">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </p>
        );
      },
    },
    {
      id: "started_at",
      header: "Started At",
      accessorKey: "started_at",
      size: 150,
      minSize: 150,
      cell: ({ row }) => {
        return (
          <p className="text-sm">
            {dayjs(row.original.started_at).format("D MMM YYYY, HH:mm")}
          </p>
        );
      },
    },
  ];

  const assistant_options = useMemo(() => {
    const assistant_map = new Map<
      string,
      { label: string; value: string; count: number }
    >();

    if (!data) return [];

    data.forEach((call) => {
      const key = call.assistant_id;
      if (assistant_map.has(key)) {
        assistant_map.get(key)!.count += 1;
      } else {
        assistant_map.set(key, {
          label: call.assistant.name,
          value: call.assistant_id,
          count: 1,
        });
      }
    });

    return Array.from(assistant_map.values());
  }, [data]);

  const ended_reason_options = useMemo(() => {
    const ended_reason_map = new Map<
      string,
      { label: string; value: string; count: number }
    >();

    if (!data) return [];

    data.forEach((call) => {
      const key = call.ended_reason;
      if (!key || !call.ended_reason) return;
      if (ended_reason_map.has(key)) {
        ended_reason_map.get(key)!.count += 1;
      } else {
        ended_reason_map.set(key, {
          label: formatCallEndedReason(key),
          value: key,
          count: 1,
        });
      }
    });

    return Array.from(ended_reason_map.values());
  }, [data]);

  const call_type_options = useMemo(() => {
    const call_type_map = new Map<
      string,
      { label: string; value: string; count: number }
    >();

    if (!data) return [];

    data.forEach((call) => {
      const key = call.type;
      if (call_type_map.has(key)) {
        call_type_map.get(key)!.count += 1;
      } else {
        call_type_map.set(key, {
          label: CALL_TYPE_TO_TEXT[key as keyof typeof CALL_TYPE_TO_TEXT],
          value: key,
          count: 1,
        });
      }
    });

    return Array.from(call_type_map.values());
  }, [data]);

  const exportCalls = () => {
    console.log("exporting calls");
  };

  const bulk_actions = useMemo(() => {
    return [
      {
        label:
          selected_row_ids.length === table_data.length && table_data.length > 0
            ? "Deselect all (" + selected_row_ids.length + ")"
            : "Select all",
        icon: selected_row_ids.length > 0 ? X : Check,
        onClick: () => {
          if (selected_row_ids.length > 0) {
            setSelectedRowIds([]);
          } else {
            setSelectedRowIds(table_data.map((call) => call.id));
          }
        },
        disabled: false,
        // active: selected_row_ids.length > 0,
      },
      {
        label: show_selected ? "Show all" : "Show selected",
        icon: show_selected ? Eye : EyeOff,
        onClick: () => {
          setShowSelected(!show_selected);
        },
        active: show_selected,
        disabled: selected_row_ids.length === 0,
      },
    ] as {
      label: string;
      icon: React.ElementType;
      type?: "destructive" | "default";
      description?: string;
      onClick: () => void;
      active?: boolean;
      disabled?: boolean;
    }[];
  }, [selected_row_ids]);

  if (is_loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full ">
      {/* <h1 className="text-2xl font-norma mb-3">Calls</h1> */}
      <div>
        <div className="flex flex-row justify-between gap-2 mb-4">
          {/*Filters section*/}
          <div className="flex flex-row gap-2 ">
            <input
              placeholder="Search..."
              value={search_string}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              className="py-1 rounded-md text-xs w-48 border border-neutral-200 px-2"
            />

            <DropdownFilter
              label="Assistant"
              options={assistant_options}
              values={selected_assistant_ids}
              onChange={(values) => {
                setSelectedAssistantIds(values);
              }}
              width="w-48"
            />
            <DropdownFilter
              label="Call Type"
              options={call_type_options}
              values={selected_call_type}
              onChange={(values) => {
                setSelectedCallType(values);
              }}
              width="w-48"
            />
            <DropdownFilter
              label="Ended Reason"
              options={ended_reason_options}
              values={selected_ended_reason}
              onChange={(values) => {
                setSelectedEndedReason(values);
              }}
            />
            {/* <DropdownFilter
            label="Success"
            options={success_options}
            values={selected_success}
            onChange={(values) => {
              setSelectedSuccess(values);
            }}
          /> */}
          </div>
          <div>
            <div className="flex items-center relative ml-auto">
              <div className="text-sm font-light mr-2">
                <span className="text-sm font-normal">
                  {selected_row_ids.length}
                </span>{" "}
                calls selected
              </div>
              <div className="flex items-center rounded-md border divide-x">
                <button
                  className="text-xs text-black flex items-center justify-center px-2.5 select-none py-[3px] transition hover:bg-neutral-100 bg-white border-neutral-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white rounded-l-md"
                  disabled={selected_row_ids.length === 0}
                  onClick={exportCalls}
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Export
                </button>
                <button
                  className={`text-xs text-black flex gap-1 items-center justify-center px-2.5 select-none py-[3px] transition hover:bg-neutral-100 bg-white border-neutral-200 whitespace-nowrap ml-1 ${
                    show_selected || selected_row_ids.length > 0
                      ? "filter-select"
                      : ""
                  } ${
                    show_selected ||
                    bulk_actions_open ||
                    selected_row_ids.length > 0
                      ? ""
                      : "hover:border-neutral-200"
                  } ${
                    bulk_actions_open
                      ? "bg-neutral-100 border-neutral-200"
                      : "hover:bg-neutral-100 "
                  }  border-neutral-200 whitespace-nowrap rounded-r-md`}
                  onClick={() => {
                    setBulkActionsOpen(!bulk_actions_open);
                  }}
                  ref={bulk_action_ref}
                >
                  More
                  <motion.div
                    className={`w-3 h-3 text-neutral-700 flex items-center justify-center`}
                    animate={{
                      rotate: bulk_actions_open ? 180 : 0,
                      marginTop: bulk_actions_open ? "0px" : "2.125px",
                    }}
                  >
                    <ChevronDownIcon className="h-full w-full" />
                  </motion.div>{" "}
                  {bulk_actions_open && (
                    <div className="absolute z-[999] rounded-lg drop-shadow-lg top-full overflow-hidden right-0 translate-y-[10px] bg-white text-sm flex flex-col border border-neutral-200 h-fit w-[270px]">
                      {bulk_actions.map((action, index) => (
                        <button
                          className={`p-3 transition ${
                            action.disabled
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          } group hover:bg-neutral-100 flex justify-start items-start  gap-2 ${
                            index !== 0 ? "border-t border-neutral-200" : " "
                          } ${
                            action.active
                              ? "text-blue-500 bg-blue-50"
                              : "bg-white"
                          } ${
                            action.type === "destructive"
                              ? "text-red-500 hover:bg-red-500 hover:text-white"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            action?.onClick && action.onClick();
                          }}
                          disabled={action.disabled}
                        >
                          {React.createElement(action.icon, {
                            className: `pl-1 w-4 h-4 pt-0.5`,
                          })}
                          <div className="flex flex-col justify-start items-start ml-1">
                            <div
                              className={`text-sm  transition ${
                                action.active
                                  ? "text-blue-500"
                                  : "text-neutral-900"
                              } ${
                                action.type === "destructive"
                                  ? "text-red-500 group-hover:text-white"
                                  : ""
                              }`}
                            >
                              {action.label}
                            </div>
                            {action?.description && (
                              <p
                                className={`text-sm text-neutral-700 w-full whitespace-normal pt-1.5 pr-1 text-left font-light ${
                                  action.type === "destructive"
                                    ? "text-red-500 group-hover:text-white"
                                    : ""
                                }`}
                              >
                                {action?.description}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        {data && (
          <TableView
            selected_row_ids={selected_row_ids}
            setSelectedRowIds={setSelectedRowIds}
            data={table_data}
            tooltip_ref={tooltip_ref}
            columns={table_columns}
            default_sort={{ id: "started_at", desc: true }}
          />
        )}
      </div>
      {selected_call_id && (
        <Slideover
          open={!!selected_call_id}
          onClose={() => {
            params.delete("call_id");
            navigate(`${pathname}?${params.toString()}`, { replace: true });
          }}
          title={`Call Report - ${
            table_data.find((call) => call.id === selected_call_id)?.vapi_id
          }`}
        >
          <CallReportView call_id={selected_call_id} />
        </Slideover>
      )}
    </div>
  );
}

export default CallsTable;
