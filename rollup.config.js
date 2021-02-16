import dts from "rollup-plugin-dts";

export default [
  {
    input: ["dist/index.d.ts", "dist/typeorm.d.ts"],
    output: {
      dir: "dist",
      exports: "auto",
      preserveModules: true,
      preserveModulesRoot: "src",
      sourcemap: true,
    },
    plugins: [dts()],
  },
];
