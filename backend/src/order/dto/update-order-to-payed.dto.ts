import { IsString, IsDefined, IsEmail } from 'class-validator';

export class UpdateOrderToPayedDto {
  @IsDefined()
  @IsString()
  status: string;

  @IsDefined()
  @IsString()
  update_time: string;

  @IsDefined()
  @IsEmail()
  email_address: string;
}
