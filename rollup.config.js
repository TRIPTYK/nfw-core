import dts from "rollup-plugin-dts";
export default [
  {
    input: "dist/index.d.ts",
    output: {
      file: "index.d.ts",
    },
    plugins: [dts()],
  },
  {
    input: "dist/typeorm.d.ts",
    output: {
      file: "typeorm.d.ts",
    },
    plugins: [dts()],
  },
];
