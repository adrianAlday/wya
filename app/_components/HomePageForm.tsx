"use client";

import React, { useState } from "react";
import Input from "./Input";
import { Params } from "../_utils/types";
import { encodeParam } from "../_utils/helpers";
import Button, { ButtonStyles } from "./Button";

type HomePageFormProps = {
  resolvedSearchParams: Params;
};
const HomePageForm = ({ resolvedSearchParams }: HomePageFormProps) => {
  const [query, setQuery] = useState(
    (resolvedSearchParams.query as string) || "",
  );
  const [name, setName] = useState((resolvedSearchParams.name as string) || "");

  const canSubmit = query;
  const submitUrl = canSubmit
    ? `/${encodeParam(query)}/${encodeParam(name)}`
    : {};

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (canSubmit && event.key === "Enter") {
      window.open(submitUrl as string, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <React.Fragment>
      <Input
        label={"Query"}
        placeholder={"Where are we going..."}
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <Input
        label={"Custom name"}
        placeholder={"What should we call it..."}
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <Button
        text={"Let's go"}
        url={submitUrl}
        buttonStyle={query ? ButtonStyles.Primary : ButtonStyles.Secondary}
      />
    </React.Fragment>
  );
};

export default HomePageForm;
