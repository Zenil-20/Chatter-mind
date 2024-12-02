import React from 'react'
import { TextField } from '@mui/material'
type Props = {
    name: string;
    type: string;
    label: string;
}

const CustomedInput = (props: Props) => {
  return (
    <TextField 
      role="input"
      margin="normal"
      InputLabelProps ={{style:
        {color:"#F8F8F8", 
        fontSize: 25, 
        fontWeight: "bold", 
        fontFamily: "cursive", 
        textShadow: "2px 2px #000",}}}
      name={props.name}
      label={props.label}
      type={props.type}
      InputProps ={{style:{ width: "400px", borderRadius: 10, fontSize: 25, color:"white"}}}
    />

  );
};

export default CustomedInput