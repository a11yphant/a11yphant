import { Test } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';

describe('prisma module', () => {
    it('can instantiate the module', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PrismaModule]
        }).compile();
        expect(moduleRef).toBeTruthy();
    })
})