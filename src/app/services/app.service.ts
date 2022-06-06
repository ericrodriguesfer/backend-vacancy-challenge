import { Injectable, InternalServerErrorException } from '@nestjs/common';
import IReponseDefaultRoute from '../contract/IResponseDefaultRoute';

@Injectable()
class AppService {
  async execute(): Promise<IReponseDefaultRoute> {
    try {
      return {
        message:
          'This api is a proposed solution to the backend challenge vacancy',
      };
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Internal server error, please try again',
      );
    }
  }
}

export default AppService;
