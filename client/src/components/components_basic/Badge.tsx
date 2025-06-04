import React from "react";

export default function Badge({
  text,
  bg_color = "gray",
  padding = "px-3 py-1",
  text_size = "text-sm",
  icon,
  icon_size = "w-4 h-4",
}: {
  text: string;
  bg_color?: string;
  padding?: string;
  text_size?: string;
  icon?: React.ElementType;
  icon_size?: string;
}) {
  const color_map = {
    gray: "bg-gray-100 border-gray-200 text-gray-800",
    red: "bg-red-100 border-red-200 text-red-800",
    blue: "bg-blue-100 border-blue-200 text-blue-800",
    green: "bg-green-100 border-green-200 text-green-800",
    yellow: "bg-yellow-100 border-yellow-200 text-yellow-800",
    purple: "bg-purple-100 border-purple-200 text-purple-800",
    pink: "bg-pink-100 border-pink-200 text-pink-800",
    indigo: "bg-indigo-100 border-indigo-200 text-indigo-800",
  };

  const color_classes =
    color_map[bg_color as keyof typeof color_map] || color_map.gray;

  if (!text) {
    return null;
  }

  return (
    <div
      className={`${color_classes} ${padding} flex items-center gap-1 rounded-full border  ${
        text_size ?? "text-sm"
      }`}
    >
      {icon && React.createElement(icon, { className: icon_size })}
      {text}
    </div>
  );
}
