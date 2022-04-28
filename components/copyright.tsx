import { Typography } from "@mui/material";
import Link from "next/link";

const Copyright= (props: any) => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link href="https://lanterns-studios.com/">
          Lanterns Studios
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  export default Copyright;