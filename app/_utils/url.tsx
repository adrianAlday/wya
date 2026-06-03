import { ParamValue } from "next/dist/server/request/params";
import { Params } from "./types";

const decodeString = (value: ParamValue) =>
  decodeURIComponent(value as unknown as string)
    .replace(/\+/g, " ")
    .trim();

export const decodeParams = (resolvedParams: Params) =>
  Object.fromEntries(
    Object.entries(resolvedParams).map(([key, value]) => [
      key,
      decodeString(value),
    ]),
  );

export const encodeParam = (value: string) =>
  encodeURIComponent(value).replace(/%20/g, "+").replace(/%2C/g, ",");
