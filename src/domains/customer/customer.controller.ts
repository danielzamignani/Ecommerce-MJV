import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../auth/local/local-auth.guard";
import { CustomerService } from "./customer.service";
import { CreateCustomerDTO } from "./dto/create-customer.dto";

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    ) {}

  @Post()
  createSeller(@Body() createCustomerDTO: CreateCustomerDTO) {
    return this.customerService.createCustomer(createCustomerDTO);
  }
}

