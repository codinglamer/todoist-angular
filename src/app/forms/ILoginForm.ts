import { FormControl } from '@angular/forms';

export interface ILoginForm {
  emailOrUsername: FormControl<string | null>;
  password: FormControl<string | null>;
}
