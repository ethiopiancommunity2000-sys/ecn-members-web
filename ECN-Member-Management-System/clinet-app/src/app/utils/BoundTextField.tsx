import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import type { ChangeEvent, FC } from 'react';
import type { Member } from '../lib/types';

interface BoundTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'name'> {
  name: keyof Member;
  label: string;
  value: string | boolean;
  setValue: (
    key: keyof Member,
    value: string | boolean,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const BoundTextField: FC<BoundTextFieldProps> = ({ name, label, value, setValue, ...props }) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={(e) => setValue(name, e.target.value, e)}
      {...props}
    />
  );
};

export default BoundTextField;

//Usage in your form as follows:
// Usage in your form
// <BoundTextField
//   name="firstName"
//   label="First Name"
//   value={member.firstName}
//   setValue={setValue}
// />

// <BoundTextField
//   name="lastName"
//   label="Last Name"
//   value={member.lastName}
//   setValue={setValue}
// />
