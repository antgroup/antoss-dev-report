declare module '*.csv' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default Array as { [key: string]: any };
}
