interface Params {
  [key: string]: string | number;
}

export const getRouteByParams = (route: string, params: Params) => {
  let newRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    newRoute = newRoute.replace(`:${key}`, value as string);
  });
  return newRoute;
};

export const getRouteByQueryParams = (route: string, queryParams: Params) => {
  let newRoute = route;

const queryParamsArr = Object.entries(queryParams).filter((params) => params?.[1]);

queryParamsArr.forEach(([key,value], index) => {
  const prefix = index === 0 ? '?' : '&';
  newRoute = `${newRoute}${prefix}${key}=${value}`
})

return newRoute;
}