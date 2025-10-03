import { forwardRef, useEffect } from "react";
import type { ReactNode } from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
  meta?: ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...other }, ref) => {
    useEffect(() => {
      if (title) {
        document.title = title;
      }
    }, [title]);

    return (
      <Box ref={ref} {...other}>
        {children}
      </Box>
    );
  }
);

export default Page;
