import React, { FC } from 'react';
import { JwtHeaderInterceptor } from './interceptors/jwt-header.interceptor';
import axios from 'axios';

type NavigatorWrapperProps = {
  Stack: any
};

const NavigatorWrapper: FC<NavigatorWrapperProps> = ({ Stack, children }) => {
  console.log('axios request interceptors BEFORE', axios.interceptors.request);
  JwtHeaderInterceptor();
  console.log('axios request interceptors AFTER', axios.interceptors.request);
  return <Stack.Navigator>
    { children }
  </Stack.Navigator>;
};

export default NavigatorWrapper;
