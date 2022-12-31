import React, { FC, ReactNode } from "react";

import "./subTitle.css";

export const SubTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <h2 className="subTitle">{children}</h2>;
};
