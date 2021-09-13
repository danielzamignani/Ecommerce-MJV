import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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

