import React, { FC, ReactNode } from "react";

import "./title.css";

export const Title: FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className="title">{children}</h1>
);
