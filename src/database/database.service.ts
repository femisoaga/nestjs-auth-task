import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private connection: Connection) { }

  onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB already connected');
    }

    this.connection.on('connected', () => {
      this.logger.log('✅ Successfully connected to MongoDB');
    });

    this.connection.on('error', (err) => {
      this.logger.error('❌ Connection error:', err);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('🔌 Disconnected from MongoDB');
    });
  }
}
