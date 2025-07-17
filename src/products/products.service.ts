import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    return await this.prismaService.product.create({
      data: createProductDto
    })
  }

  async findAll() {
   return await this.prismaService.product.findMany()
  }

  async findOne(id: number) {
    const product= await this.prismaService.product.findUnique({
      where: {
        id
      }
    })
    if(!product){
      throw new NotFoundException('Product not found')
    }

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
