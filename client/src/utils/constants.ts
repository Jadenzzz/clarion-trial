import { Globe, LogIn, LogOut } from "lucide-react";

export const GRADIENT_BG = "bg-gradient-to-br from-blue-500 to-purple-600 ";
export const GRADIENT_BG_HOVER =
  "bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800";

export const CALL_TYPES = {
  WEB: "webCall",
  INBOUND: "inboundPhoneCall",
  OUTBOUND: "outboundPhoneCall",
} as const;

export const CALL_TYPE_TO_TEXT = {
  [CALL_TYPES.WEB]: "Web",
  [CALL_TYPES.INBOUND]: "Inbound",
  [CALL_TYPES.OUTBOUND]: "Outbound",
};

export const CALL_TYPE_TO_COLOR = {
  [CALL_TYPES.WEB]: "purple",
  [CALL_TYPES.INBOUND]: "green",
  [CALL_TYPES.OUTBOUND]: "yellow",
};

export const CALL_TYPE_TO_ICON = {
  [CALL_TYPES.WEB]: Globe,
  [CALL_TYPES.INBOUND]: LogIn,
  [CALL_TYPES.OUTBOUND]: LogOut,
};

export const ENDED_REASON_TO_TEXT = {};
