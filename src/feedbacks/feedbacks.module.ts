import { Module } from '@nestjs/common';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { User } from 'src/users/user.entity';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  imports: [TypeOrmModule.forFeature([Feedback, User]), TokensModule, UsersModule],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
