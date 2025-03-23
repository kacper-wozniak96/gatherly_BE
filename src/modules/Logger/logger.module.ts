import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { join } from 'path';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-pretty', // Logs to console
              options: {
                colorize: true, // Colorize logs for better readability
                levelFirst: true, // Show log level first
                translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o', // Format timestamps
              },
            },
            {
              target: 'pino/file', // Logs to file
              options: {
                destination: join(__dirname, 'logs/app.log'), // Specify the file path
                mkdir: true, // Create the directory if it doesn't exist
              },
            },
          ],
        },
      },
    }),
  ],
  exports: [PinoLoggerModule], // Export the module so it can be used elsewhere
})
export class LoggerModule {}
