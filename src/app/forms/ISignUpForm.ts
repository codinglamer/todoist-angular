import { FormControl } from '@angular/forms';

export interface ISignUpForm {
  displayName: FormControl<string | null>;
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirmation: FormControl<string | null>;
}
