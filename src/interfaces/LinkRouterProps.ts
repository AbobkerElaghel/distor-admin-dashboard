import { LinkProps } from "@mui/material/Link";

export default interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}