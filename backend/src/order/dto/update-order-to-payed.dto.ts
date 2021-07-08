import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsEmail } from 'class-validator';

export class UpdateOrderToPayedDto {
  @ApiProperty({
    description: 'Status of transaction',
    type: String,
  })
  @IsDefined()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Update time',
    type: String,
  })
  @IsDefined()
  @IsString()
  update_time: string;

  @ApiProperty({
    description: 'Email',
    type: String,
  })
  @IsDefined()
  @IsEmail()
  email_address: string;
}
