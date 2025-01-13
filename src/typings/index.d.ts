type MessageEventType<T = any> = {
  type: string;
  data?: T;
  Json?: any;
};
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
