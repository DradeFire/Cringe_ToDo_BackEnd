import BaseSwaggerUtils from "core/base-swagger-utils";
import { IAdditionalHQ } from "core/swagger-classes";
import { Constants } from "utils/constants";


export default class SwaggerUtils extends BaseSwaggerUtils {
  static accessTokenHQ(extras?: IAdditionalHQ) {
    return {
      headers: {
        [Constants.HEADER_ACCESS_TOKEN]: Constants.HEADER_ACCESS_TOKEN,
        ...extras?.headers,
      },
      query: {
        [Constants.HEADER_ACCESS_TOKEN + '?']: Constants.HEADER_ACCESS_TOKEN,
        ...extras?.query,
      },
    };
  }

  static twoTokens() {
    return this.body200({
      accessToken: 'token1',
      refreshToken: 'token2',
    });
  }
}
