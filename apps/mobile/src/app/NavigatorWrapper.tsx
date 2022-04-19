import React, { FC } from 'react';
import { JwtHeaderInterceptor } from './interceptors/jwt-header.interceptor';

type NavigatorWrapperProps = {
  Stack: any
};

const NavigatorWrapper: FC<NavigatorWrapperProps> = ({ Stack, children }) => {
  JwtHeaderInterceptor();
  return <Stack.Navigator>
    { children }
  </Stack.Navigator>;
};

export default NavigatorWrapper;
