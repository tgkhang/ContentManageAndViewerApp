import { Helmet } from "react-helmet-async";
import { forwardRef, ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface PageProps extends BoxProps {
  children: ReactNode;
  title?: string;
  meta?: ReactNode;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", meta, ...other }, ref) => (
    <>
      <Helmet>
        <title>{title}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  )
);

export default Page;
