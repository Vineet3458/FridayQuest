declare module 'json-logic-js' {
  const jsonLogic: {
    apply: (rules: any, data?: any) => any;
    add_operation: (name: string, op: (...args: any[]) => any) => void;
  };
  export default jsonLogic;
}

