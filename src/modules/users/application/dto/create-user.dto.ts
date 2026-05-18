import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../shared/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'joao@escola.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
