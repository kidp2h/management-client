import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
  baseUrl: ''!,
  prepareHeaders: headers => {
    // const accessToken = (getState() as RootState).auth.accessToken;
    // if (accessToken) {
    //   headers.set('Authorization', `Bearer ${accessToken}`);
    //   headers.set('Access-Control-Allow-Origin', '*');
    // }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  // if (result.error && result.error.status === 401) {
  //   const refreshToken = (api.getState() as RootState).auth.refreshToken;
  //   const refreshResult = await baseQuery(
  //     {
  //       url: '/auth/refresh',
  //       method: 'POST',
  //       body: { refreshToken },
  //     },
  //     { ...api },
  //     extraOptions,
  //   );
  //   if (refreshResult.data) {
  //     api.dispatch(
  //       setCredentials({
  //         currentUser: null,
  //         accessToken: (refreshResult.data as any).data.accessToken,
  //         refreshToken: refreshToken!,
  //       }),
  //     );
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     api.dispatch(logout());
  //   }
  // }
  return result;
};
